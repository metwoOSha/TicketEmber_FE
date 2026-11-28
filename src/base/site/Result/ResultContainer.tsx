'use client';

import { useOrder } from '@/hooks/useOrders';
import { formatMoney, formatDay, formatTime } from '@/utils/format';
import { formatSeats } from '@/utils/hall';
import Result, { type ResultStatus } from './Result';

const isStatus = (value: string | undefined): value is ResultStatus => value === 'paid' || value === 'declined' || value === 'expired';

/** Loads the order for the one-line summary and picks the variant from ?status=. */
export default function ResultContainer({ id, status }: { id: string; status: string | undefined }) {
    const { data: order } = useOrder(id);
    const summary = order
        ? `${order.movieTitle} · ${formatDay(order.startsAt)} · ${formatTime(order.startsAt)} · ${formatSeats(order.seats)} · ${formatMoney(order.totalCents)} · Order ${order.code}`
        : undefined;

    return <Result status={isStatus(status) ? status : 'expired'} orderId={id} sessionId={order?.sessionId} summary={summary} />;
}
