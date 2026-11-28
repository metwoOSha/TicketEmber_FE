'use client';

import dayjs from 'dayjs';
import TicketStub from '@/components/TicketStub/TicketStub';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/auth.store';

/** Right side of the header: "LOG IN →" for guests, "NAME | 02" (active tickets) when logged in. */
export default function HeaderAccount() {
    const user = useAuthStore((s) => s.user);
    const { data: orders } = useOrders();

    if (!user) return <TicketStub href="/login" label="LOG IN" extra="→" ariaLabel="Log in" />;

    const active = (orders ?? []).filter(
        (o) => (o.status === 'paid' || o.status === 'pending') && dayjs(o.startsAt).isAfter(dayjs())
    ).length;

    return (
        <TicketStub
            href="/my-tickets"
            label={user.name.toUpperCase()}
            extra={String(active).padStart(2, '0')}
            ariaLabel="Account"
            title={`${active} active tickets`}
        />
    );
}
