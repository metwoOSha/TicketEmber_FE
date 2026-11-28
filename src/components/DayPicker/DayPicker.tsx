'use client';

import clsx from 'clsx';
import { formatDayLabel } from '@/utils/days';
import cls from './DayPicker.module.css';

type Props = {
    /** "YYYY-MM-DD" list */
    days: string[];
    value: string;
    onChange: (day: string) => void;
};

export default function DayPicker({ days, value, onChange }: Props) {
    return (
        <div className={cls.days}>
            {days.map((day) => (
                <button key={day} type="button" className={clsx(cls.day, day === value && cls.active)} onClick={() => onChange(day)}>
                    {formatDayLabel(day)}
                </button>
            ))}
        </div>
    );
}
