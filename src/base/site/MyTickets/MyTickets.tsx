'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import PageContainer from '@/components/PageContainer/PageContainer';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useCancelOrder, useOrders } from '@/hooks/useOrders';
import type { Order } from '@/types/booking.types';
import TicketRow from './TicketRow/TicketRow';
import cls from './MyTickets.module.css';

type Tab = 'upcoming' | 'history';
const TABS: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: 'UPCOMING' },
    { key: 'history', label: 'HISTORY' },
];

/** Upcoming: awaiting payment or paid, and the session has not started. Everything else is history. */
const isUpcoming = (o: Order) => (o.status === 'pending' || o.status === 'paid') && dayjs(o.startsAt).isAfter(dayjs());

export default function MyTickets() {
    const { data: orders, isPending } = useOrders();
    const cancel = useCancelOrder();
    const [tab, setTab] = useState<Tab>('upcoming');

    const rows = (orders ?? []).filter((o) => (tab === 'upcoming') === isUpcoming(o));

    return (
        <PageContainer>
            <h1 className={cls.title}>My tickets</h1>
            <div className={cls.tabs} role="tablist">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.key}
                        className={cls.tab}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {isPending && <Skeleton height={170} />}
            {rows.map((order) => (
                <TicketRow
                    key={order.id}
                    order={order}
                    cancelling={cancel.isPending && cancel.variables === order.id}
                    onCancel={cancel.mutate}
                />
            ))}
            {!isPending && rows.length === 0 && <div className={cls.empty}>Nothing here yet.</div>}

            <div className={cls.more}>
                <div>
                    <span className={cls.moreLabel}>NOW SHOWING</span>
                    <span className={cls.moreTitle}>Something else to watch</span>
                </div>
                <Link href="/" className={cls.moreLink}>
                    Explore movies →
                </Link>
            </div>
        </PageContainer>
    );
}
