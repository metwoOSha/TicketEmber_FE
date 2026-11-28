'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Badge from '@/components/admin/Badge/Badge';
import Card from '@/components/admin/Card/Card';
import EmptyState from '@/components/admin/EmptyState/EmptyState';
import { SearchField } from '@/components/admin/Field/Field';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import Segmented from '@/components/admin/Segmented/Segmented';
import Table, { Pager, SortHeader, tableCls } from '@/components/admin/Table/Table';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import Notice from '@/components/Notice/Notice';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAdminOrders } from '@/hooks/admin/useAdminData';
import { useDebounced } from '@/hooks/useDebounced';
import type { OrderFilter } from '@/types/admin.types';
import { ORDER_STATUS } from '@/utils/admin-status';
import { formatDay, formatMoney, formatTime } from '@/utils/format';
import OrderDetails from './OrderDetails';
import cls from './Orders.module.css';

const STATUSES: { value: OrderFilter['status']; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Awaiting payment' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function Orders() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState(params.get('q') ?? '');
    const [status, setStatus] = useState<OrderFilter['status']>('all');
    const [sort, setSort] = useState<OrderFilter['sort']>('created');
    const [page, setPage] = useState(1);
    const debounced = useDebounced(query, 250);
    const { data, isPending, isError, refetch, isFetching } = useAdminOrders({ status, query: debounced, sort, page });

    // The selected order is in the URL (?order=), so links from the dashboard open it
    const selectedId = params.get('order') ?? data?.items[0]?.id;
    const selected = data?.items.find((o) => o.id === selectedId) ?? data?.items[0];
    const select = (id: string) => {
        const next = new URLSearchParams(params);
        next.set('order', id);
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    };

    const changeFilter = (fn: () => void) => {
        fn();
        setPage(1);
    };

    return (
        <>
            <PageHeader
                title="Orders"
                sub="Every booking, paid or not. Unpaid orders expire 15 minutes after they are created."
                actions={
                    // TODO: GET /admin/orders/export.csv
                    <Button variant="ghost" size="md">
                        <Icon name="download" size={16} />
                        Export CSV
                    </Button>
                }
            />

            <div className={cls.filters}>
                <Segmented
                    label="Status"
                    options={STATUSES.map((s) => ({ ...s, count: data?.counts[s.value] }))}
                    value={status}
                    onChange={(v) => changeFilter(() => setStatus(v))}
                />
                <SearchField
                    label="Order code or email"
                    className={cls.search}
                    value={query}
                    onChange={(e) => changeFilter(() => setQuery(e.target.value))}
                />
            </div>

            <div className={cls.cols}>
                <Card aria-label="Orders">
                    {isError && (
                        <div className={cls.error}>
                            <Notice tone="danger">Can&apos;t load orders. The server did not answer. Nothing was changed.</Notice>
                            <Button variant="ghost" size="md" loading={isFetching} onClick={() => void refetch()}>
                                <Icon name="refresh" size={16} />
                                Try again
                            </Button>
                        </div>
                    )}
                    {isPending && (
                        <div className={cls.skeleton} aria-busy="true" aria-label="Loading orders">
                            {Array.from({ length: 6 }, (_, i) => (
                                <Skeleton key={i} height={44} />
                            ))}
                        </div>
                    )}
                    {data && (
                        <>
                            <Table className={cls.table}>
                                <thead>
                                    <tr>
                                        <SortHeader label="Order" active={sort === 'created'} onSort={() => setSort('created')} />
                                        <th>Customer</th>
                                        <th>Showtime and seats</th>
                                        <SortHeader label="Total" align="right" active={sort === 'total'} onSort={() => setSort('total')} />
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((o) => (
                                        <tr key={o.id} aria-selected={o.id === selected?.id}>
                                            <td className={tableCls.nowrap}>
                                                <button
                                                    type="button"
                                                    className={cls.code}
                                                    aria-pressed={o.id === selected?.id}
                                                    onClick={() => select(o.id)}
                                                >
                                                    {o.code}
                                                </button>
                                                <div className={cls.muted}>{formatTime(o.createdAt)}</div>
                                            </td>
                                            <td className={cls.wrap}>{o.email}</td>
                                            <td className={cls.wrap}>
                                                <div>{o.movieTitle}</div>
                                                <div className={cls.muted}>
                                                    {formatDay(o.startsAt)} {formatTime(o.startsAt)}, {o.hallName}. Seats{' '}
                                                    {o.seats.join(', ')}
                                                </div>
                                            </td>
                                            <td className={`${tableCls.right} ${tableCls.num} ${cls.strong}`}>
                                                {formatMoney(o.totalCents)}
                                            </td>
                                            <td>
                                                <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {data.items.length === 0 && (
                                <EmptyState
                                    title="No orders found"
                                    text="Nothing matches this status and search. Try another status or clear the search."
                                />
                            )}
                            <Pager page={data.page} pages={data.pages} total={data.total} shown={data.items.length} onPage={setPage} />
                        </>
                    )}
                </Card>

                {selected && <OrderDetails key={selected.id} order={selected} />}
            </div>
        </>
    );
}
