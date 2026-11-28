'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import PageContainer from '@/components/PageContainer/PageContainer';
import Notice from '@/components/Notice/Notice';
import { ApiError } from '@/api/http';
import { useCancelOrder, useCreateOrder, useUnpaidOrder } from '@/hooks/useOrders';
import { useSeatMap } from '@/hooks/useSeats';
import { useAuthStore } from '@/store/auth.store';
import { useBookingStore } from '@/store/booking.store';
import { formatDay, formatTime } from '@/utils/format';
import { getHallLayout, MAX_SEATS } from '@/utils/hall';
import OrderStub, { type SeatGroup } from './OrderStub/OrderStub';
import SeatLegend from './SeatLegend/SeatLegend';
import SeatMap from './SeatMap/SeatMap';
import SeatsSkeleton from './SeatsSkeleton';
import UnpaidModal from './UnpaidModal/UnpaidModal';
import ZoomControls from './ZoomControls/ZoomControls';
import cls from './Seats.module.css';

export default function Seats({ sessionId }: { sessionId: string }) {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const guest = !user;
    const { selection, setSelection } = useBookingStore();

    const { data: map, isPending } = useSeatMap(sessionId);
    const { data: unpaid } = useUnpaidOrder(!guest);
    const createOrder = useCreateOrder();
    const cancelOrder = useCancelOrder();

    // Seats picked before logging in come back after the redirect
    const [selected, setSelected] = useState<string[]>(() => (selection?.sessionId === sessionId ? selection.seats : []));
    const [zoom, setZoom] = useState<number | null>(null);
    const [modalClosed, setModalClosed] = useState(false);
    const [liveCount, setLiveCount] = useState(0);
    const knownTaken = useRef<Set<string> | null>(null);

    const layout = useMemo(() => (map ? getHallLayout(map.hall) : null), [map]);
    const taken = useMemo(() => new Set(map?.taken ?? []), [map]);

    // Seats that others took while we were looking: drop them from our pick and show a note
    useEffect(() => {
        if (!map) return;
        const prev = knownTaken.current;
        knownTaken.current = new Set(map.taken);
        if (!prev) return;
        const fresh = map.taken.filter((id) => !prev.has(id));
        if (fresh.length) {
            setLiveCount((n) => n + fresh.length);
            setSelected((s) => s.filter((id) => !fresh.includes(id)));
        }
    }, [map]);

    if (isPending || !map || !layout) {
        return <PageContainer>{isPending ? <SeatsSkeleton /> : <p className={cls.missing}>Session not found.</p>}</PageContainer>;
    }

    const kindOf = new Map(layout.rows.flatMap((r) => r.seats).map((s) => [s.id, s.kind]));
    const centsOf = (id: string) => (kindOf.get(id) === 'premium' ? map.premiumCents : map.standardCents);

    const groups: SeatGroup[] = (['standard', 'premium'] as const)
        .map((kind) => {
            const seats = selected.filter((id) => kindOf.get(id) === kind).sort();
            return {
                label: kind === 'standard' ? 'Standard' : layout.premiumLabel,
                seats,
                cents: seats.reduce((sum, id) => sum + centsOf(id), 0),
            };
        })
        .filter((g) => g.seats.length > 0);
    const totalCents = groups.reduce((sum, g) => sum + g.cents, 0);

    const conflictSeat =
        createOrder.error instanceof ApiError && createOrder.error.status === 409 ? (selected.find((id) => taken.has(id)) ?? null) : null;
    const conflictMessage = createOrder.error instanceof ApiError && createOrder.error.status === 409 ? createOrder.error.message : null;

    const fitZoom = layout.fitZoom;
    const currentZoom = zoom ?? fitZoom;
    const total = layout.rows.reduce((n, r) => n + r.seats.length, 0);
    const free = total - taken.size;

    const toggle = (id: string) => {
        createOrder.reset();
        setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= MAX_SEATS ? s : [...s, id]));
    };

    const onContinue = () => {
        const next = { sessionId, movieTitle: map.movieTitle, startsAt: map.startsAt, seats: selected };
        if (guest) {
            setSelection(next);
            router.push(`/login?next=${encodeURIComponent(`/seats/${sessionId}`)}`);
            return;
        }
        setSelection(null);
        createOrder.mutate({ sessionId, seats: selected });
    };

    return (
        <PageContainer>
            <div className={cls.page}>
                <div className={cls.main}>
                    <div className={cls.head}>
                        <Link href={`/movies/${map.movieId}`} className={cls.back}>
                            ← BACK
                        </Link>
                        <h1 className={cls.title}>{map.movieTitle}</h1>
                        <span className={cls.meta}>
                            {formatDay(map.startsAt)} · {formatTime(map.startsAt)} · {map.hall}
                        </span>
                    </div>

                    <div className={cls.body}>
                        <SeatMap
                            layout={layout}
                            hall={map.hall}
                            taken={taken}
                            selected={selected}
                            flashing={conflictSeat}
                            zoom={layout.big ? currentZoom : 1}
                            standardCents={map.standardCents}
                            premiumCents={map.premiumCents}
                            onToggle={toggle}
                        />
                        {conflictMessage && <Notice tone="danger">{conflictMessage} Pick another one.</Notice>}
                        {liveCount > 0 && (
                            <Notice tone="warning">
                                {liveCount} {liveCount === 1 ? 'seat was' : 'seats were'} just taken by others
                            </Notice>
                        )}
                        {layout.big && <ZoomControls zoom={currentZoom} fit={fitZoom} onChange={setZoom} />}
                        <SeatLegend
                            premiumLabel={layout.premiumLabel}
                            standardCents={map.standardCents}
                            premiumCents={map.premiumCents}
                            free={free}
                            total={total}
                        />
                    </div>
                </div>

                <OrderStub
                    movieTitle={map.movieTitle}
                    startsAt={map.startsAt}
                    hall={map.hall}
                    groups={groups}
                    totalCents={totalCents}
                    guest={guest}
                    loading={createOrder.isPending}
                    onRemove={toggle}
                    onContinue={onContinue}
                />
            </div>

            {unpaid && !modalClosed && (
                <UnpaidModal
                    order={unpaid}
                    cancelling={cancelOrder.isPending}
                    onCancel={() => cancelOrder.mutate(unpaid.id)}
                    onClose={() => setModalClosed(true)}
                />
            )}
        </PageContainer>
    );
}
