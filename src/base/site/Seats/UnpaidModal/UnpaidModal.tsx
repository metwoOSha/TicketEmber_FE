'use client';

import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useCountdown } from '@/hooks/useCountdown';
import type { Order } from '@/types/booking.types';
import { formatDay, formatTime } from '@/utils/format';
import cls from './UnpaidModal.module.css';

type Props = { order: Order; cancelling: boolean; onCancel: () => void; onClose: () => void };

/** You can hold only one unpaid order: pay for it or cancel it first. */
export default function UnpaidModal({ order, cancelling, onCancel, onClose }: Props) {
    const { clock } = useCountdown(order.expiresAt);

    return (
        <Modal label="Unpaid order" onClose={onClose}>
            <div className={cls.card}>
                <span className={cls.eyebrow}>UNPAID ORDER</span>
                <h2 className={cls.title}>You already have an unpaid order</h2>
                <p className={cls.movie}>
                    {order.movieTitle} · {formatDay(order.startsAt)} · {formatTime(order.startsAt)}
                </p>
                <p className={cls.left}>{clock} left to pay</p>
                <Button href={`/checkout/${order.id}`} arrow className={cls.cta}>
                    Continue paying
                </Button>
                <button type="button" className={cls.cancel} disabled={cancelling} onClick={onCancel}>
                    Cancel it and choose new seats
                </button>
            </div>
        </Modal>
    );
}
