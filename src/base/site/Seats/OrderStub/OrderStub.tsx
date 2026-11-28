import Button from '@/components/Button/Button';
import { formatDay, formatMoney, formatTime } from '@/utils/format';
import { HOLD_MINUTES, MAX_SEATS } from '@/utils/hall';
import cls from './OrderStub.module.css';

export type SeatGroup = { label: string; seats: string[]; cents: number };

type Props = {
    movieTitle: string;
    startsAt: string;
    hall: string;
    groups: SeatGroup[];
    totalCents: number;
    guest: boolean;
    loading: boolean;
    onRemove: (seat: string) => void;
    onContinue: () => void;
};

/** Ticket-shaped summary of the picked seats, on the right of the seat map. */
export default function OrderStub({ movieTitle, startsAt, hall, groups, totalCents, guest, loading, onRemove, onContinue }: Props) {
    // "Today · 24 Nov" or "Wed 25 Nov" -> two lines
    const [dayTop, dayBottom] = formatDay(startsAt).includes(' · ')
        ? formatDay(startsAt).split(' · ')
        : [formatDay(startsAt).split(' ')[0], formatDay(startsAt).split(' ').slice(1).join(' ')];
    const empty = groups.length === 0;

    return (
        <aside className={cls.stub}>
            <div className={cls.top}>
                <div className={cls.holo} />
                <span className={cls.label}>ADMIT</span>
                <div className={cls.title}>{movieTitle}</div>
                <div className={cls.when}>
                    <div className={cls.time}>{formatTime(startsAt)}</div>
                    <div className={cls.date}>
                        <div className={cls.dateTop}>{dayTop}</div>
                        <div>{dayBottom}</div>
                    </div>
                </div>
                <span className={cls.hall}>{hall.toUpperCase()}</span>

                <div className={cls.seats}>
                    {empty ? (
                        <p className={cls.empty}>Pick up to {MAX_SEATS} seats on the map</p>
                    ) : (
                        groups.map((group) => (
                            <div key={group.label} className={cls.group}>
                                <div className={cls.groupHead}>
                                    <span>
                                        {group.label} ×{group.seats.length}
                                    </span>
                                    <span>{formatMoney(group.cents)}</span>
                                </div>
                                <div className={cls.chips}>
                                    {group.seats.map((seat) => (
                                        <button
                                            key={seat}
                                            type="button"
                                            className={cls.chip}
                                            onClick={() => onRemove(seat)}
                                            aria-label={`Remove seat ${seat}`}
                                        >
                                            {seat} <span aria-hidden>×</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className={cls.perf} />

            <div className={cls.bottom}>
                <div className={cls.total}>
                    <span className={cls.totalLabel}>TOTAL</span>
                    <span className={cls.totalValue}>{formatMoney(totalCents)}</span>
                </div>
                <Button arrow disabled={empty} loading={loading} onClick={onContinue} className={cls.cta}>
                    {guest ? 'Log in to continue' : 'Continue'}
                </Button>
                <p className={cls.note}>Order is created when you continue</p>
                <p className={cls.note}>
                    {guest
                        ? `Log in first. Seats are held for ${HOLD_MINUTES} min after that`
                        : `Seats are held for ${HOLD_MINUTES} min after you continue`}
                </p>
            </div>
        </aside>
    );
}
