'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Badge from '@/components/admin/Badge/Badge';
import Card from '@/components/admin/Card/Card';
import ConfirmDialog from '@/components/admin/Dialog/ConfirmDialog';
import { TextField } from '@/components/admin/Field/Field';
import HallGrid, { SeatSwatch } from '@/components/admin/HallGrid/HallGrid';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import StatTiles from '@/components/admin/StatTiles/StatTiles';
import Button from '@/components/Button/Button';
import Notice from '@/components/Notice/Notice';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useCancelShowtime, useHalls, useShowtime, useUpdatePrices } from '@/hooks/admin/useAdminData';
import { type PricesValues, pricesSchema, toCents } from '@/schemas/admin.schema';
import { useAdminUi } from '@/store/admin-ui.store';
import type { AdminOrder, AdminShowtime } from '@/types/admin.types';
import { ORDER_STATUS, SHOWTIME_STATUS } from '@/utils/admin-status';
import { buildHallLayout } from '@/utils/admin-hall';
import { CINEMA_TZ, formatDay, formatMoney, formatTime } from '@/utils/format';
import cls from './Showtime.module.css';

export default function Showtime({ id }: { id: string }) {
    const { data, isPending } = useShowtime(id);
    const { data: halls } = useHalls();

    if (isPending || !halls) return <Skeleton height={600} radius={10} />;
    if (!data) return <p>Showtime not found.</p>;
    return <ShowtimeView showtime={data.showtime} orders={data.orders} hall={halls.find((h) => h.id === data.showtime.hallId)!} />;
}

function ShowtimeView({
    showtime: s,
    orders,
    hall,
}: {
    showtime: AdminShowtime;
    orders: AdminOrder[];
    hall: Parameters<typeof buildHallLayout>[0];
}) {
    const toast = useAdminUi((st) => st.toast);
    const cancel = useCancelShowtime();
    const [confirm, setConfirm] = useState(false);
    const rows = buildHallLayout(hall);
    const taken = new Set(s.taken);
    const held = new Set(s.held);
    const stateOf = (seatId: string) => (held.has(seatId) ? 'held' : taken.has(seatId) ? 'sold' : 'free');
    const pending = orders.filter((o) => o.status === 'pending');
    const cancelled = s.status === 'cancelled';
    const active = !cancelled && s.status !== 'finished';
    const doorsAt = dayjs(s.startsAt).subtract(20, 'minute').tz(CINEMA_TZ).format('HH:mm');
    const revenue = formatMoney(s.revenueCents);

    return (
        <>
            {cancelled && (
                <Notice tone="danger">This showtime is cancelled. Paid orders were refunded and the customers got an email.</Notice>
            )}
            <PageHeader
                back={{ href: '/admin/showtimes', label: 'Showtimes' }}
                title={s.movieTitle}
                badge={<Badge tone={SHOWTIME_STATUS[s.status].tone}>{SHOWTIME_STATUS[s.status].label}</Badge>}
                sub={`${formatDay(s.startsAt)}, ${formatTime(s.startsAt)}–${formatTime(s.endsAt)}, ${s.hallName}, ${s.format}, ${s.language}`}
                actions={
                    active && (
                        <>
                            <Button variant="ghost" size="md" href={`/admin/check-in?showtime=${s.id}`}>
                                Open check-in
                            </Button>
                            <Button variant="danger" size="md" onClick={() => setConfirm(true)}>
                                Cancel showtime
                            </Button>
                        </>
                    )
                }
            />

            <StatTiles
                stats={[
                    { label: 'Sold', value: `${s.sold} / ${s.capacity}`, note: `${Math.round((s.sold / s.capacity) * 100)}% full` },
                    { label: 'Revenue', value: revenue, note: `${s.paidOrders} paid orders` },
                    { label: 'Inside', value: String(s.inside), note: `Of ${s.sold}, doors open ${doorsAt}` },
                    {
                        label: 'On hold',
                        value: `${s.held.length} seats`,
                        note: pending[0] ? `Order ${pending[0].code}` : 'No unpaid orders',
                    },
                ]}
            />

            <div className={cls.cols}>
                <Card
                    title="Seats"
                    actions={<span className={cls.hint}>Updates every 15 s. Held seats free up when their order expires.</span>}
                >
                    <div className={cls.map}>
                        <HallGrid
                            mode="view"
                            rows={rows}
                            stateOf={stateOf}
                            label={`Seat map: ${taken.size} sold, ${held.size} on hold, ${s.capacity - taken.size - held.size} free`}
                        />
                    </div>
                    <div className={cls.legend}>
                        <span>
                            <SeatSwatch kind="standard" state="sold" /> Sold <b>{taken.size}</b>
                        </span>
                        <span>
                            <SeatSwatch kind="standard" state="held" /> On hold <b>{held.size}</b>
                        </span>
                        <span>
                            <SeatSwatch kind="standard" /> Free <b>{s.capacity - taken.size - held.size}</b>
                        </span>
                        <span>
                            <SeatSwatch kind="premium" state="sold" /> Premium or sofa (gold top)
                        </span>
                    </div>
                </Card>

                <div className={cls.side}>
                    {active && <PricesForm showtime={s} />}
                    <Card
                        title="Orders"
                        actions={
                            <Link href="/admin/orders" className={cls.link}>
                                All orders
                            </Link>
                        }
                    >
                        <ul className={cls.orders}>
                            {orders.map((o) => (
                                <li key={o.id}>
                                    <span>
                                        <Link href={`/admin/orders?order=${o.id}`} className={cls.code}>
                                            {o.code}
                                        </Link>
                                        <span className={cls.hint}>{o.seats.join(', ')}</span>
                                    </span>
                                    <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                                </li>
                            ))}
                            {orders.length === 0 && <li className={cls.hint}>No orders yet.</li>}
                        </ul>
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                open={confirm}
                title={`Cancel ${s.movieTitle}, ${s.hallName} ${formatTime(s.startsAt)}?`}
                consequences={[
                    `${s.paidOrders} paid orders are refunded, ${revenue} in total.`,
                    `${pending.length} unpaid orders are cancelled and their seats are released.`,
                    'Every customer gets an email about the cancellation.',
                    'The showtime disappears from the site and check-in stops.',
                ]}
                acknowledge={`I understand that ${s.paidOrders} customers will be refunded`}
                confirmLabel={`Cancel and refund ${revenue}`}
                cancelLabel="Keep showtime"
                loading={cancel.isPending}
                onClose={() => setConfirm(false)}
                onConfirm={() =>
                    cancel.mutate(s.id, {
                        onSuccess: () => {
                            setConfirm(false);
                            toast('Showtime cancelled. Refunds are on the way.');
                        },
                    })
                }
            />
        </>
    );
}

function PricesForm({ showtime }: { showtime: AdminShowtime }) {
    const toast = useAdminUi((st) => st.toast);
    const update = useUpdatePrices();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<PricesValues>({
        resolver: zodResolver(pricesSchema),
        defaultValues: { standard: showtime.standardCents / 100, premium: showtime.premiumCents / 100 },
    });

    const onSubmit = handleSubmit((v) =>
        update.mutate(
            { showtimeId: showtime.id, standardCents: toCents(v.standard), premiumCents: toCents(v.premium) },
            {
                onSuccess: () => {
                    reset(v);
                    toast('Prices saved. They apply to new orders.');
                },
            }
        )
    );

    return (
        <Card title="Prices">
            <form className={cls.prices} onSubmit={onSubmit} noValidate>
                <div className={cls.pricesGrid}>
                    <TextField
                        label="Standard, $"
                        type="number"
                        step="0.5"
                        error={errors.standard?.message}
                        describedBy="prices-hint"
                        {...register('standard', { valueAsNumber: true })}
                    />
                    <TextField
                        label="Premium, $"
                        type="number"
                        step="0.5"
                        error={errors.premium?.message}
                        describedBy="prices-hint"
                        {...register('premium', { valueAsNumber: true })}
                    />
                </div>
                <span id="prices-hint" className={cls.hint}>
                    New prices apply to new orders. Paid orders keep the price they paid.
                </span>
                <Button type="submit" variant="ghost" size="md" disabled={!isDirty} loading={update.isPending}>
                    Save prices
                </Button>
            </form>
        </Card>
    );
}
