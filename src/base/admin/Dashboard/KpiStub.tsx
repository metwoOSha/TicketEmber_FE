import type { DashboardData, Period } from '@/types/admin.types';
import { formatChange } from '@/utils/admin-status';
import { formatMoney } from '@/utils/format';
import cls from './KpiStub.module.css';

const COMPARE: Record<Period, string> = { today: 'yesterday', week: 'last week', month: 'last month' };

/** The four numbers of the period on a ticket with perforations, like the site's tickets. */
export default function KpiStub({ data, period }: { data: DashboardData; period: Period }) {
    const vs = COMPARE[period];
    const tone = (n: number) => (n >= 0 ? cls.up : cls.down);

    return (
        <dl className={cls.stub} aria-label="Numbers for the period">
            <div className={cls.stat}>
                <dt className={cls.label}>Revenue</dt>
                <dd className={cls.value}>{formatMoney(data.revenueCents)}</dd>
                <dd className={tone(data.revenueChange)}>
                    {formatChange(data.revenueChange, '%')} vs {vs}
                </dd>
            </div>
            <div className={cls.stat}>
                <dt className={cls.label}>Tickets sold</dt>
                <dd className={cls.value}>{data.ticketsSold.toLocaleString('en-US')}</dd>
                <dd className={tone(data.ticketsChange)}>
                    {formatChange(data.ticketsChange)} vs {vs}
                </dd>
            </div>
            <div className={cls.stat}>
                <dt className={cls.label}>Occupancy</dt>
                <dd className={cls.value}>{data.occupancy}%</dd>
                <dd className={cls.note}>Across {data.showtimesCount} showtimes</dd>
            </div>
            <div className={cls.stat}>
                <dt className={cls.label}>Awaiting payment</dt>
                <dd className={`${cls.value} ${cls.warn}`}>{data.awaitingPayment}</dd>
                <dd className={cls.warn}>Seats held for up to 15 min</dd>
            </div>
        </dl>
    );
}
