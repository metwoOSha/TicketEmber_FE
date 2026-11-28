'use client';

import dayjs from 'dayjs';
import Switch from '@/components/Switch/Switch';
import { useNotify, useUpcoming } from '@/hooks/useUpcoming';
import { CINEMA_TZ } from '@/utils/format';
import cls from './ComingSoon.module.css';

export default function ComingSoon() {
    const { data: films = [] } = useUpcoming();
    const { mutate: notify } = useNotify();

    return (
        <>
            <h1 className={cls.title}>Coming soon</h1>
            <p className={cls.lead}>Turn on Notify me and we email you when sales open.</p>
            <div className={cls.grid}>
                {films.map((film, i) => (
                    <article key={film.id} className={cls.card} style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
                        <div
                            className={cls.poster}
                            style={{
                                background: `radial-gradient(circle at 50% 30%, rgb(255 255 255 / 0.22), transparent 55%), linear-gradient(170deg, ${film.tint[0]}, ${film.tint[1]})`,
                            }}
                        />
                        <h2 className={cls.name}>{film.title}</h2>
                        <p className={cls.meta}>{film.meta}</p>
                        <div className={cls.release}>
                            <span className={cls.when}>
                                <span className={cls.kicker}>{film.kicker}</span>
                                <span>{dayjs.tz(film.releaseDate, CINEMA_TZ).format('ddd D MMM')}</span>
                            </span>
                            <Switch
                                checked={film.notify}
                                label={`Notify me about ${film.title}`}
                                onChange={(value) => notify({ id: film.id, notify: value })}
                            />
                        </div>
                        <p className={film.notify ? cls.on : cls.off}>
                            {film.notify ? "We'll email you when sales open" : 'Notifications off'}
                        </p>
                    </article>
                ))}
            </div>
        </>
    );
}
