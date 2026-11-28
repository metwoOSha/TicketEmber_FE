'use client';

import clsx from 'clsx';
import { useState } from 'react';
import Card from '@/components/admin/Card/Card';
import { TextField } from '@/components/admin/Field/Field';
import HallGrid, { SeatSwatch } from '@/components/admin/HallGrid/HallGrid';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import Segmented from '@/components/admin/Segmented/Segmented';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import Notice from '@/components/Notice/Notice';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useHalls, useSaveHall } from '@/hooks/admin/useAdminData';
import { useAdminUi } from '@/store/admin-ui.store';
import type { Hall, SeatKind } from '@/types/admin.types';
import { baseKind, buildHallLayout, countSeats } from '@/utils/admin-hall';
import cls from './Halls.module.css';

const TOOLS: { value: SeatKind; label: string }[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'sofa', label: 'Sofa' },
    { value: 'blocked', label: 'Blocked' },
];

const clamp = (value: string, max: number) => Math.max(1, Math.min(max, parseInt(value, 10) || 1));

export default function Halls() {
    const { data: halls } = useHalls();
    const [selectedId, setSelectedId] = useState('small');

    if (!halls) return <Skeleton height={600} radius={10} />;
    const selected = halls.find((h) => h.id === selectedId) ?? halls[0];

    return (
        <>
            <PageHeader
                title="Halls"
                sub="Seat layouts used for new showtimes."
                actions={
                    // TODO: POST /admin/halls
                    <Button variant="ghost" size="md" disabled title="Comes with the backend">
                        <Icon name="plus" size={16} />
                        Add hall
                    </Button>
                }
            />
            <div className={cls.cols}>
                <fieldset className={cls.list}>
                    <legend className="sr-only">Halls</legend>
                    {halls.map((h) => {
                        const count = countSeats(buildHallLayout(h));
                        return (
                            <button
                                key={h.id}
                                type="button"
                                className={clsx(cls.hall, h.id === selected.id && cls.on)}
                                aria-pressed={h.id === selected.id}
                                onClick={() => setSelectedId(h.id)}
                            >
                                <span className={cls.hallName}>{h.name}</span>
                                <span className={cls.muted}>
                                    {count.sellable} seats, {h.rows} rows, {h.formats.join(', ')}
                                </span>
                            </button>
                        );
                    })}
                </fieldset>
                {/* Remount per hall so the draft starts from that hall */}
                <HallEditor key={selected.id} hall={selected} />
            </div>
        </>
    );
}

function HallEditor({ hall }: { hall: Hall }) {
    const [draft, setDraft] = useState(hall);
    const [tool, setTool] = useState<SeatKind>('blocked');
    const save = useSaveHall();
    const toast = useAdminUi((s) => s.toast);
    const rows = buildHallLayout(draft);
    const count = countSeats(rows);
    const dirty = JSON.stringify(draft) !== JSON.stringify(hall);

    const paint = (seatId: string, rowName: string, current: SeatKind) => {
        const base = baseKind(draft, rowName);
        const next = current === tool ? base : tool;
        const overrides = { ...draft.overrides };
        if (next === base) delete overrides[seatId];
        else overrides[seatId] = next;
        setDraft({ ...draft, overrides });
    };

    return (
        <Card title={`${draft.name} layout`} actions={<Segmented label="Paint seats as" options={TOOLS} value={tool} onChange={setTool} />}>
            <div className={cls.editor}>
                <div className={cls.dims}>
                    <TextField label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                    <TextField
                        label="Rows"
                        type="number"
                        min={1}
                        max={26}
                        value={draft.rows}
                        onChange={(e) => setDraft({ ...draft, rows: clamp(e.target.value, 26) })}
                    />
                    <TextField
                        label="Seats per row"
                        type="number"
                        min={1}
                        max={30}
                        value={draft.cols}
                        onChange={(e) => setDraft({ ...draft, cols: clamp(e.target.value, 30) })}
                    />
                    <TextField
                        label="Aisles after seat"
                        hint="Seat numbers, comma separated"
                        defaultValue={draft.aisles.join(', ')}
                        onBlur={(e) =>
                            setDraft({
                                ...draft,
                                aisles: e.target.value
                                    .split(',')
                                    .map((x) => parseInt(x, 10))
                                    .filter((x) => x > 0),
                            })
                        }
                    />
                </div>

                <div className={cls.map}>
                    <HallGrid
                        mode="edit"
                        rows={rows}
                        label={`${draft.name} seat layout`}
                        onPaint={(seat, rowName) => paint(seat.id, rowName, seat.kind)}
                    />
                </div>

                <div className={cls.legend}>
                    <span>
                        <SeatSwatch kind="standard" /> Standard <b>{count.standard}</b>
                    </span>
                    <span>
                        <SeatSwatch kind="premium" /> Premium <b>{count.premium}</b>
                    </span>
                    <span>
                        <SeatSwatch kind="sofa" /> Sofa for two <b>{count.sofa}</b>
                    </span>
                    <span>
                        <SeatSwatch kind="blocked" /> Blocked <b>{count.blocked}</b>
                    </span>
                    <span className={cls.muted}>
                        Sellable: <b className={cls.strong}>{count.sellable}</b>
                    </span>
                </div>

                <Notice tone="warning">Changes apply to new showtimes only. Showtimes that already sold tickets keep their layout.</Notice>

                <div className={cls.actions}>
                    <span className={cls.muted} aria-live="polite">
                        {dirty ? 'Unsaved changes' : 'All changes saved'}
                    </span>
                    <Button variant="ghost" size="md" disabled={!dirty} onClick={() => setDraft(hall)}>
                        Discard changes
                    </Button>
                    <Button
                        size="md"
                        disabled={!dirty}
                        loading={save.isPending}
                        onClick={() => save.mutate(draft, { onSuccess: () => toast(`${draft.name} layout saved.`) })}
                    >
                        Save layout
                    </Button>
                </div>
            </div>
        </Card>
    );
}
