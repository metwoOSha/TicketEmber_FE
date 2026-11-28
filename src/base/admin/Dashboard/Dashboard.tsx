'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import Badge from '@/components/admin/Badge/Badge';
import Bar from '@/components/admin/Bar/Bar';
import Card from '@/components/admin/Card/Card';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import Segmented from '@/components/admin/Segmented/Segmented';
import Table, { tableCls } from '@/components/admin/Table/Table';
import Chip from '@/components/Chip/Chip';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDashboard } from '@/hooks/admin/useAdminData';
import type { AttentionItem, Period } from '@/types/admin.types';
import { ORDER_STATUS, SHOWTIME_STATUS } from '@/utils/admin-status';
import { CINEMA_TZ, formatMoney, formatTime } from '@/utils/format';
import KpiStub from './KpiStub';
import cls from './Dashboard.module.css';

const PERIODS = [
    { value: 'today' as const, label: 'Today' },
    { value: 'week' as const, label: '7 days' },
    { value: 'month' as const, label: '30 days' },
];

const LEVEL: Record<AttentionItem['level'], { label: string; tone: 'warn' | 'bad' | 'info' }> = {
    warning: { label: 'Warning', tone: 'warn' },
    problem: { label: 'Problem', tone: 'bad' },
    info: { label: 'Info', tone: 'info' },
};

export default function Dashboard() {
    const [period, setPeriod] = useState<Period>('today');
    const { data } = useDashboard(period);
    const now = dayjs().tz(CINEMA_TZ);
    const toStart = data?.showtimes.filter((s) => dayjs(s.startsAt).isAfter(now)).length ?? 0;

    return (
        <>
            <PageHeader
                title={now.format('dddd, D MMM')}
                sub={
                    data
                        ? `Prospekt Mall, Kyiv. ${data.showtimes.length} showtimes today, ${toStart} still to start.`
                        : 'Prospekt Mall, Kyiv.'
                }
                actions={<Segmented label="Period" options={PERIODS} value={period} onChange={setPeriod} />}
            />

            {data ? <KpiStub data={data} period={period} /> : <Skeleton height={132} radius={10} />}

            <div className={cls.cols}>
                <Card
                    title="Today's showtimes"
                    actions={
                        <Link href="/admin/showtimes" className={cls.link}>
                            Open schedule
                        </Link>
                    }
                >
                    {data ? (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Movie</th>
                                    <th>Hall</th>
                                    <th>Sold</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.showtimes.map((s) => (
                                    <tr key={s.id}>
                                        <td className={cls.time}>
                                            <Link href={`/admin/showtimes/${s.id}`}>{formatTime(s.startsAt)}</Link>
                                        </td>
                                        <td className={tableCls.nowrap}>
                                            <span className={cls.movie}>
                                                {s.movieTitle} <Chip>{s.format}</Chip>
                                            </span>
                                        </td>
                                        <td className={`${tableCls.nowrap} ${cls.muted}`}>{s.hallName}</td>
                                        <td>
                                            <span className={cls.sold}>
                                                <Bar value={s.sold} max={s.capacity} />
                                                <span className={tableCls.num}>
                                                    {s.sold} / {s.capacity}
                                                </span>
                                            </span>
                                        </td>
                                        <td>
                                            <Badge tone={SHOWTIME_STATUS[s.status].tone}>{SHOWTIME_STATUS[s.status].label}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className={cls.loading}>
                            <Skeleton height={300} />
                        </div>
                    )}
                </Card>

                <div className={cls.side}>
                    <Card title="Needs attention">
                        <ul className={cls.list}>
                            {data?.attention.map((a) => (
                                <li key={a.id} className={cls.item}>
                                    <Badge tone={LEVEL[a.level].tone}>{LEVEL[a.level].label}</Badge>
                                    <span className={cls.itemText}>
                                        <span className={cls.itemTitle}>{a.title}</span>
                                        <span className={cls.muted}>{a.text}</span>
                                        <Link href={a.href} className={cls.link}>
                                            {a.cta}
                                        </Link>
                                    </span>
                                </li>
                            ))}
                            {data && data.attention.length === 0 && <li className={cls.item}>All clear for now.</li>}
                        </ul>
                    </Card>

                    <Card
                        title="Recent orders"
                        actions={
                            <Link href="/admin/orders" className={cls.link}>
                                All orders
                            </Link>
                        }
                    >
                        <ul className={cls.list}>
                            {data?.recentOrders.map((o) => (
                                <li key={o.id} className={cls.order}>
                                    <span className={cls.orderMain}>
                                        <Link href={`/admin/orders?order=${o.id}`} className={cls.code}>
                                            {o.code}
                                        </Link>
                                        <span className={cls.email}>{o.email}</span>
                                    </span>
                                    <span className={cls.orderSide}>
                                        <span className={cls.total}>{formatMoney(o.totalCents)}</span>
                                        <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </>
    );
}
