'use client';

import { useBookingStore } from '@/store/booking.store';
import { formatDayLabel } from '@/utils/days';
import { formatTime } from '@/utils/format';
import cls from './HoldNotice.module.css';

/** Shown on the login page when the user picked seats before logging in. */
export default function HoldNotice() {
    const selection = useBookingStore((s) => s.selection);
    if (!selection) return null;

    const day = selection.startsAt.slice(0, 10);

    return (
        <div className={cls.notice}>
            <span className={cls.eyebrow}>YOUR SEATS</span>
            <span className={cls.title}>Log in to hold these seats</span>
            <span className={cls.details}>
                {selection.movieTitle} · {formatDayLabel(day)} · {formatTime(selection.startsAt)} · {selection.seats.join(', ')}
            </span>
            <span className={cls.hint}>The 15-minute hold starts after you log in.</span>
        </div>
    );
}
