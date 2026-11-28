'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { HOLD_MINUTES } from '@/utils/hall';

/** Seconds left until `expiresAt`, ticking every second. */
export function useCountdown(expiresAt: string | undefined) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const left = expiresAt ? Math.max(0, Math.ceil(dayjs(expiresAt).diff(now) / 1000)) : 0;
    const clock = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
    const percent = Math.min(100, Math.round((left / (HOLD_MINUTES * 60)) * 100));

    return { left, clock, percent, expired: !!expiresAt && left === 0 };
}
