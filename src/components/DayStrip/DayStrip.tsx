'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { formatDayLabel } from '@/utils/days';
import cls from './DayStrip.module.css';

const VISIBLE = 7;
const STEP = 3;

type Props = {
    /** "YYYY-MM-DD" list */
    days: string[];
    value: string;
    onChange: (day: string) => void;
    /** Days that have nothing to show; they stay clickable but look muted. */
    mutedDays?: string[];
};

/** Row of days with ‹ › arrows that slide the visible window. */
export default function DayStrip({ days, value, onChange, mutedDays = [] }: Props) {
    const [offset, setOffset] = useState(0);
    const maxOffset = Math.max(0, days.length - VISIBLE);
    const visible = days.slice(offset, offset + VISIBLE);

    return (
        <div className={cls.strip}>
            <button
                type="button"
                className={cls.arrow}
                aria-label="Earlier days"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - STEP))}
            >
                ‹
            </button>
            <div className={cls.days}>
                {visible.map((day) => (
                    <button
                        key={day}
                        type="button"
                        aria-pressed={day === value}
                        className={clsx(cls.day, day === value && cls.active, mutedDays.includes(day) && cls.muted)}
                        onClick={() => onChange(day)}
                    >
                        {formatDayLabel(day)}
                    </button>
                ))}
            </div>
            <button
                type="button"
                className={cls.arrow}
                aria-label="Later days"
                disabled={offset === maxOffset}
                onClick={() => setOffset(Math.min(maxOffset, offset + STEP))}
            >
                ›
            </button>
        </div>
    );
}
