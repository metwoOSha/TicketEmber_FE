'use client';

import { useMemo, useState } from 'react';
import DayStrip from '@/components/DayStrip/DayStrip';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import { useMovieSessions } from '@/hooks/useMovies';
import { formatDayLabel, getNextDays } from '@/utils/days';
import { getSessionDay } from '@/utils/session';
import SessionRow from './SessionRow';
import cls from './Sessions.module.css';

const DAYS = getNextDays(14);

export default function Sessions({ movieId }: { movieId: string }) {
    const { data: sessions = [] } = useMovieSessions(movieId);
    const [day, setDay] = useState(DAYS[0]);

    const byDay = useMemo(() => {
        const map = new Map<string, typeof sessions>();
        for (const s of sessions) {
            const key = getSessionDay(s);
            map.set(key, [...(map.get(key) ?? []), s]);
        }
        return map;
    }, [sessions]);

    const dayList = byDay.get(day) ?? [];
    const nextDay = DAYS.find((d) => d > day && byDay.has(d));
    const emptyDays = DAYS.filter((d) => !byDay.has(d));

    return (
        <section className={cls.section}>
            <div className={cls.head}>
                <SectionTitle>SESSIONS</SectionTitle>
                <DayStrip days={DAYS} value={day} onChange={setDay} mutedDays={emptyDays} />
            </div>
            <div className={cls.cols} aria-hidden>
                <span>START</span>
                <span>FORMAT</span>
                <span>HALL</span>
                <span>ENDS</span>
                <span>SEATS</span>
                <span>PRICE</span>
                <span />
            </div>
            <div className={cls.list}>
                {dayList.map((s) => (
                    <SessionRow key={s.id} session={s} />
                ))}
                {dayList.length === 0 && (
                    <div className={cls.empty}>
                        <span className={cls.emptyTitle}>No sessions on this day</span>
                        <span>Pick another date, or jump to the next day with sessions.</span>
                        {nextDay && (
                            <button type="button" className={cls.jump} onClick={() => setDay(nextDay)}>
                                Next available: {formatDayLabel(nextDay)} →
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
