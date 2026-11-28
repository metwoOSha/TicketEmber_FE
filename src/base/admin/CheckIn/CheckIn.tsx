'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useRef, useState } from 'react';
import Badge from '@/components/admin/Badge/Badge';
import Bar from '@/components/admin/Bar/Bar';
import Card from '@/components/admin/Card/Card';
import { SelectField, TextField } from '@/components/admin/Field/Field';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import Button from '@/components/Button/Button';
import { useAdmitTicket, useCheckTicket, useScans, useShowtimes } from '@/hooks/admin/useAdminData';
import type { CheckResult, ScanEntry, TicketCheck, Tone } from '@/types/admin.types';
import { getNextDays } from '@/utils/days';
import { formatDay, formatTime } from '@/utils/format';
import cls from './CheckIn.module.css';

const VERDICT: Record<CheckResult, { title: string; text: string; tone: 'ok' | 'warn' | 'bad' }> = {
    valid: { title: 'Valid ticket', text: 'Paid and not used yet. Mark it as used when the guest goes in.', tone: 'ok' },
    used: { title: 'Already used', text: 'This ticket was scanned before. Do not let a second person in on it.', tone: 'warn' },
    'wrong-showtime': {
        title: 'Different showtime',
        text: 'The ticket is valid, but for another showtime. Send the guest to the right hall.',
        tone: 'warn',
    },
    unpaid: {
        title: 'Not paid',
        text: 'The order is still waiting for payment. The guest can pay on their phone and show the ticket again.',
        tone: 'bad',
    },
    'not-found': {
        title: 'Ticket not found',
        text: 'No ticket has this ID. Check for typos, or ask the guest for the email with their tickets.',
        tone: 'bad',
    },
};

const SCAN: Record<ScanEntry['result'], { label: string; tone: Tone }> = {
    'checked-in': { label: 'Checked in', tone: 'ok' },
    valid: { label: 'Checked, not admitted', tone: 'info' },
    used: { label: 'Already used', tone: 'warn' },
    'wrong-showtime': { label: 'Other showtime', tone: 'warn' },
    unpaid: { label: 'Not paid', tone: 'bad' },
    'not-found': { label: 'Not found', tone: 'bad' },
};

export default function CheckIn() {
    const params = useSearchParams();
    const { data: showtimes } = useShowtimes(getNextDays(1)[0]);
    const open = (showtimes ?? []).filter((s) => s.status !== 'finished' && s.status !== 'cancelled');
    const [showtimeId, setShowtimeId] = useState(params.get('showtime') ?? '');
    const current = open.find((s) => s.id === showtimeId) ?? open.find((s) => dayjs(s.startsAt).isAfter(dayjs())) ?? open[0];

    const [ticketId, setTicketId] = useState('');
    const [result, setResult] = useState<TicketCheck | null>(null);
    const input = useRef<HTMLInputElement>(null);
    const check = useCheckTicket();
    const admit = useAdmitTicket();
    const { data: scans } = useScans();

    const onCheck = (e: FormEvent) => {
        e.preventDefault();
        if (!ticketId.trim() || !current) return;
        check.mutate({ ticketId, showtimeId: current.id }, { onSuccess: setResult });
    };

    const next = () => {
        setResult(null);
        setTicketId('');
        input.current?.focus();
    };

    const verdict = result && VERDICT[result.result];
    const admitted = result?.result === 'valid' && admit.isSuccess && admit.data.ticketId === result.ticketId;

    return (
        <>
            <PageHeader
                title="Check-in"
                sub="Scan the QR code on the ticket or type its ID. Each ticket lets in one person once."
                actions={
                    <SelectField
                        label="Checking in for"
                        className={cls.showtime}
                        value={current?.id ?? ''}
                        onChange={(e) => setShowtimeId(e.target.value)}
                    >
                        {open.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.movieTitle}, {s.hallName}, {formatTime(s.startsAt)}
                            </option>
                        ))}
                    </SelectField>
                }
            />

            <div className={cls.cols}>
                <div className={cls.main}>
                    <Card padded>
                        <form className={cls.scan} onSubmit={onCheck}>
                            <TextField
                                ref={input}
                                label="Ticket ID"
                                className={cls.ticketField}
                                value={ticketId}
                                // Scanner station: the ticket field must be ready on load
                                // oxlint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                autoComplete="off"
                                placeholder="94DC0B8C-01"
                                hint="Try E42A5F70-02, 5D3E0A9B-01, A10C77D2-01, 94DC0B8C-01"
                                onChange={(e) => setTicketId(e.target.value)}
                            />
                            <Button type="submit" size="md" loading={check.isPending}>
                                Check ticket
                            </Button>
                            {/* TODO: camera scanner (BarcodeDetector) */}
                            <Button type="button" variant="ghost" size="md" disabled title="Comes later">
                                Use camera
                            </Button>
                        </form>
                    </Card>

                    {result && verdict && (
                        <section className={clsx(cls.result, cls[admitted ? 'ok' : verdict.tone])} aria-live="polite">
                            <h2 className={cls.verdict}>{admitted ? 'Checked in' : verdict.title}</h2>
                            <p>{admitted ? 'Let the guest in.' : verdict.text}</p>
                            {result.seat && (
                                <dl className={cls.facts}>
                                    <dt>Seat</dt>
                                    <dd className={cls.seat}>
                                        Row {result.seat[0]}, seat {result.seat.slice(1)}
                                    </dd>
                                    <dt>Movie</dt>
                                    <dd>{result.movieTitle}</dd>
                                    <dt>Showtime</dt>
                                    <dd>
                                        {formatDay(result.startsAt!)}, {formatTime(result.startsAt!)}, {result.hallName}
                                    </dd>
                                    <dt>Order</dt>
                                    <dd>
                                        {result.orderCode}, {result.email}
                                    </dd>
                                    <dt>Checked in</dt>
                                    <dd>
                                        {admitted
                                            ? `Now, ${formatTime(admit.data.usedAt!)}`
                                            : result.usedAt
                                              ? formatTime(result.usedAt)
                                              : 'Not yet'}
                                    </dd>
                                </dl>
                            )}
                            <div className={cls.actions}>
                                {result.result === 'valid' && !admitted && (
                                    <Button
                                        size="md"
                                        loading={admit.isPending}
                                        onClick={() => admit.mutate({ ticketId: result.ticketId, showtimeId: current!.id })}
                                    >
                                        Mark as used
                                    </Button>
                                )}
                                <Button variant="ghost" size="md" onClick={next}>
                                    Next ticket
                                </Button>
                            </div>
                        </section>
                    )}
                </div>

                <div className={cls.side}>
                    {current && (
                        <Card title={`${current.movieTitle}, ${formatTime(current.startsAt)}`} padded>
                            <p className={cls.inside}>
                                <b>{current.inside}</b> of {current.sold} sold are inside
                            </p>
                            <Bar value={current.inside} max={current.sold} className={cls.fullBar} />
                            <p className={cls.muted}>
                                {current.hallName}. Doors open {formatTime(dayjs(current.startsAt).subtract(20, 'minute').toISOString())}.
                            </p>
                        </Card>
                    )}
                    <Card title="Last scans">
                        <ol className={cls.scans}>
                            {(scans ?? []).map((s) => (
                                <li key={s.at + s.ticketId}>
                                    <span className={cls.muted}>{formatTime(s.at)}</span>
                                    <span className={cls.code}>{s.ticketId}</span>
                                    <Badge tone={SCAN[s.result].tone}>{SCAN[s.result].label}</Badge>
                                </li>
                            ))}
                            {scans?.length === 0 && <li className={cls.muted}>No scans yet in this session.</li>}
                        </ol>
                    </Card>
                </div>
            </div>
        </>
    );
}
