'use client';

import clsx from 'clsx';
import Button from '@/components/Button/Button';
import { useCountdown } from '@/hooks/useCountdown';
import type { Order, OrderStatus } from '@/types/booking.types';
import { formatDay, formatMoney, formatTime } from '@/utils/format';
import cls from './TicketRow.module.css';

const STATUS: Record<OrderStatus, { text: string; tone: 'warning' | 'success' | 'muted' }> = {
    pending: { text: 'Awaiting payment', tone: 'warning' },
    paid: { text: '✓ Paid', tone: 'success' },
    cancelled: { text: 'Cancelled', tone: 'muted' },
    expired: { text: 'Expired', tone: 'muted' },
};

type Props = { order: Order; cancelling: boolean; onCancel: (id: string) => void };

/** One order as a horizontal ticket: time block, details, status block. */
export default function TicketRow({ order, cancelling, onCancel }: Props) {
    const { clock, percent } = useCountdown(order.status === 'pending' ? order.expiresAt : undefined);
    const status = STATUS[order.status];

    return (
        <div className={clsx(cls.row, cls[status.tone])}>
            <div className={cls.when}>
                <span className={cls.time}>{formatTime(order.startsAt)}</span>
                <span className={cls.date}>{formatDay(order.startsAt)}</span>
            </div>

            <div className={cls.info}>
                <span className={cls.title}>{order.movieTitle}</span>
                <span className={cls.place}>Prospekt Mall, Kyiv</span>
                <div className={cls.facts}>
                    <div>
                        <span className={cls.factLabel}>HALL</span>
                        <span className={cls.factValue}>{order.hall}</span>
                    </div>
                    <div>
                        <span className={cls.factLabel}>SEATS</span>
                        <span className={cls.factValue}>{order.seats.join(', ')}</span>
                    </div>
                    <div>
                        <span className={cls.factLabel}>TOTAL</span>
                        <span className={cls.factValue}>{formatMoney(order.totalCents)}</span>
                    </div>
                </div>
            </div>

            <div className={cls.status}>
                <div className={cls.statusText}>
                    <span className={cls.dot} />
                    {order.status === 'pending' ? `${status.text} · ${clock} left` : status.text}
                </div>
                {order.status === 'pending' && (
                    <div className={cls.bar}>
                        <div className={cls.fill} style={{ width: `${percent}%` }} />
                    </div>
                )}
                <div className={cls.actions}>
                    {order.status === 'pending' && (
                        <Button href={`/checkout/${order.id}`} arrow className={cls.small}>
                            Pay now
                        </Button>
                    )}
                    {order.status === 'paid' && (
                        <Button href={`/tickets/${order.id}`} arrow className={cls.small}>
                            View ticket
                        </Button>
                    )}
                    {order.status === 'pending' && (
                        <Button variant="ghost" className={cls.small} loading={cancelling} onClick={() => onCancel(order.id)}>
                            Cancel
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
