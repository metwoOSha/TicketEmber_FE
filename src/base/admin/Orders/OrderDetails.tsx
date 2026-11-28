'use client';

import { useState } from 'react';
import Badge from '@/components/admin/Badge/Badge';
import Card from '@/components/admin/Card/Card';
import ConfirmDialog from '@/components/admin/Dialog/ConfirmDialog';
import Button from '@/components/Button/Button';
import Notice from '@/components/Notice/Notice';
import { useCancelOrder } from '@/hooks/admin/useAdminData';
import { useCountdown } from '@/hooks/useCountdown';
import { useAdminUi } from '@/store/admin-ui.store';
import type { AdminOrder } from '@/types/admin.types';
import { ORDER_STATUS } from '@/utils/admin-status';
import { formatDay, formatMoney, formatTime } from '@/utils/format';
import cls from './Orders.module.css';

export default function OrderDetails({ order }: { order: AdminOrder }) {
    const [confirm, setConfirm] = useState(false);
    const cancel = useCancelOrder();
    const toast = useAdminUi((s) => s.toast);
    const { clock } = useCountdown(order.status === 'pending' ? order.expiresAt : undefined);
    const status = ORDER_STATUS[order.status];
    const paid = order.status === 'paid';
    const total = formatMoney(order.totalCents);
    const seats = order.seats.join(', ');

    const consequences = paid
        ? [
              `${total} goes back to the test card •••• 4242.`,
              `Seats ${seats} go back on sale.`,
              'The tickets stop working at the entrance.',
              `${order.email} gets an email about the refund.`,
          ]
        : [
              `Seats ${seats} go back on sale right away.`,
              'The customer can no longer pay for this order.',
              `${order.email} gets an email that the order was cancelled.`,
          ];

    const onConfirm = () =>
        cancel.mutate(order.id, {
            onSuccess: () => {
                setConfirm(false);
                toast(
                    paid ? `Order ${order.code} cancelled. ${total} refunded.` : `Order ${order.code} cancelled. Seats are back on sale.`
                );
            },
        });

    return (
        <Card as="aside" aria-label="Order details" className={cls.details}>
            <div className={cls.detailsHead}>
                <div>
                    <div className={cls.muted}>Order</div>
                    <div className={cls.bigCode}>{order.code}</div>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <div className={cls.detailsBody}>
                {order.status === 'pending' && (
                    <Notice tone="warning">
                        Not paid yet. Seats are held for <b>{clock}</b> more, then the order expires.
                    </Notice>
                )}
                <dl className={cls.facts}>
                    <dt>Customer</dt>
                    <dd>{order.email}</dd>
                    <dt>Movie</dt>
                    <dd>{order.movieTitle}</dd>
                    <dt>Showtime</dt>
                    <dd>
                        {formatDay(order.startsAt)}, {formatTime(order.startsAt)}, {order.hallName}
                    </dd>
                    <dt>Seats</dt>
                    <dd>{seats}</dd>
                    <dt>Total</dt>
                    <dd className={cls.strong}>{total}</dd>
                    <dt>Payment</dt>
                    <dd>{order.payment}</dd>
                </dl>
                <div>
                    <h3 className={cls.h3}>History</h3>
                    <ol className={cls.history}>
                        {order.events.map((e) => (
                            <li key={e.at + e.text}>
                                <span className={cls.muted}>{formatTime(e.at)}</span>
                                <span>{e.text}</span>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className={cls.detailsActions}>
                    {paid && (
                        <>
                            {/* TODO: POST /admin/orders/:id/resend */}
                            <Button variant="ghost" size="sm" onClick={() => toast(`Tickets sent again to ${order.email}.`)}>
                                Resend tickets
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => setConfirm(true)}>
                                Cancel and refund
                            </Button>
                        </>
                    )}
                    {order.status === 'pending' && (
                        <Button variant="danger" size="sm" onClick={() => setConfirm(true)}>
                            Cancel order
                        </Button>
                    )}
                    {(order.status === 'expired' || order.status === 'cancelled') && (
                        <span className={cls.muted}>Nothing to do: the seats were released.</span>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={confirm}
                title={paid ? `Cancel order ${order.code} and refund ${total}?` : `Cancel order ${order.code}?`}
                consequences={consequences}
                confirmLabel={paid ? `Cancel and refund ${total}` : 'Cancel order'}
                cancelLabel="Keep order"
                loading={cancel.isPending}
                onConfirm={onConfirm}
                onClose={() => setConfirm(false)}
            />
        </Card>
    );
}
