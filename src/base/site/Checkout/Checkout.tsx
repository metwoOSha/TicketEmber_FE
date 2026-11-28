'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PageContainer from '@/components/PageContainer/PageContainer';
import Button from '@/components/Button/Button';
import Skeleton from '@/components/Skeleton/Skeleton';
import Barcode from '@/components/TicketCard/Barcode';
import TicketCard from '@/components/TicketCard/TicketCard';
import { useCountdown } from '@/hooks/useCountdown';
import { useCancelOrder, useOrder, usePayOrder } from '@/hooks/useOrders';
import { formatMoney } from '@/utils/format';
import { formatSeats } from '@/utils/hall';
import CheckoutSteps from './CheckoutSteps';
import cls from './Checkout.module.css';

export default function Checkout({ id }: { id: string }) {
    const router = useRouter();
    const { data: order, isPending } = useOrder(id);
    const pay = usePayOrder();
    const cancel = useCancelOrder();
    const { clock, percent, expired } = useCountdown(order?.expiresAt);

    // Done, expired or cancelled orders do not belong here
    useEffect(() => {
        if (!order) return;
        if (order.status === 'paid') router.replace(`/result/${id}?status=paid`);
        else if (order.status === 'expired' || (order.status === 'pending' && expired)) router.replace(`/result/${id}?status=expired`);
        else if (order.status === 'cancelled') router.replace('/my-tickets');
    }, [order, expired, id, router]);

    if (isPending) {
        return (
            <PageContainer>
                <div className={cls.grid}>
                    <Skeleton width={480} height={640} radius={6} />
                    <Skeleton width={400} height={560} />
                </div>
            </PageContainer>
        );
    }
    if (!order) return <p className={cls.missing}>Order not found.</p>;

    const busy = pay.isPending || cancel.isPending;

    return (
        <PageContainer>
            <CheckoutSteps seatsHref={`/seats/${order.sessionId}`} />
            <div className={cls.grid}>
                <TicketCard
                    admit={`ADMIT ${order.seats.length} · ${order.hall.toUpperCase()}`}
                    movieTitle={order.movieTitle}
                    startsAt={order.startsAt}
                    seatsText={formatSeats(order.seats)}
                    bottom={<Barcode code={order.code} />}
                />

                <div className={cls.side}>
                    <span className={cls.label}>SEATS HELD FOR</span>
                    <div className={cls.clock}>{clock}</div>
                    <div className={cls.bar}>
                        <div className={cls.fill} style={{ width: `${percent}%` }} />
                    </div>
                    <p className={cls.text}>After that the order expires and the seats are released.</p>

                    <span className={cls.label + ' ' + cls.gap}>PAY WITH</span>
                    <div className={cls.method}>
                        <span className={cls.methodName}>
                            <i className={cls.dot} />
                            Test card •••• 4242
                        </span>
                        <span className={cls.demo}>Demo</span>
                    </div>
                    <p className={cls.text}>Tickets will be sent to {order.email}</p>

                    <span className={cls.label + ' ' + cls.gap}>TOTAL · {order.seats.length} TICKETS</span>
                    <div className={cls.total}>{formatMoney(order.totalCents)}</div>

                    <Button arrow loading={pay.isPending} disabled={busy} className={cls.pay} onClick={() => pay.mutate({ id })}>
                        Pay now
                    </Button>

                    <div className={cls.links}>
                        <button
                            type="button"
                            className={cls.link}
                            disabled={busy}
                            onClick={() => cancel.mutate(id, { onSuccess: () => router.push('/my-tickets') })}
                        >
                            Cancel order
                        </button>
                        <button type="button" className={cls.link} disabled={busy} onClick={() => pay.mutate({ id, simulateFail: true })}>
                            Simulate failed payment
                        </button>
                    </div>
                    <p className={cls.hint}>Test payment only. No real money is charged.</p>
                </div>
            </div>
        </PageContainer>
    );
}
