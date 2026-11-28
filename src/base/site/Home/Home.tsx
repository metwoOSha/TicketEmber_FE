'use client';

import { useState } from 'react';
import DayPicker from '@/components/DayPicker/DayPicker';
import { useMovies } from '@/hooks/useMovies';
import { getNextDays } from '@/utils/days';
import MovieColumn from './MovieColumn/MovieColumn';
import cls from './Home.module.css';

const DAYS = getNextDays(6);

export default function Home() {
    const [day, setDay] = useState(DAYS[0]);
    const { data: movies, isPending, isError } = useMovies(day);

    return (
        <div className={cls.home}>
            <div className={cls.row}>
                {movies?.map((movie, i) => (
                    <MovieColumn key={movie.id} movie={movie} index={i} />
                ))}
                {isPending && <p className={cls.state}>Loading…</p>}
                {isError && <p className={cls.state}>Could not load movies.</p>}
                {movies?.length === 0 && <p className={cls.state}>No sessions on this day.</p>}
            </div>
            <div className={cls.bar}>
                <DayPicker days={DAYS} value={day} onChange={setDay} />
                <span className={cls.hint}>HOVER A POSTER TO PICK A SESSION</span>
            </div>
        </div>
    );
}
