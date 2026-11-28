import Link from 'next/link';
import type { MovieWithSessions } from '@/types/movie.types';
import { tmdbImage } from '@/utils/tmdb';
import { formatDuration, formatPriceRange, formatTime } from '@/utils/format';
import cls from './MovieColumn.module.css';

type Props = { movie: MovieWithSessions; index: number };

/** One poster column. Grows on hover and reveals the sessions. */
export default function MovieColumn({ movie, index }: Props) {
    const poster = tmdbImage(movie.posterPath, 'w780');
    const [tint1, tint2] = movie.tint;

    return (
        <div className={cls.col} style={{ animationDelay: `${index * 0.08}s` }}>
            <div
                className={cls.art}
                style={{
                    background: `radial-gradient(ellipse 70% 38% at 50% 30%, ${tint1} 0%, transparent 72%), linear-gradient(175deg, ${tint2}, #07070a)`,
                }}
            >
                {poster && <img className={cls.poster} src={poster} alt={`${movie.title} poster`} />}
            </div>
            <div className={cls.shade} />
            <div className={cls.info}>
                <Link href={`/movies/${movie.id}`} className={cls.name}>
                    {movie.title}
                </Link>
                <div className={cls.meta}>
                    {movie.genres.join(' · ')} · {formatDuration(movie.durationMin)}
                </div>
                <div className={cls.rating}>★ {movie.rating.toFixed(1)}</div>
                <div className={cls.more}>
                    <div className={cls.sessions}>
                        {movie.sessions.map((s) => (
                            <Link key={s.id} href={`/seats/${s.id}`} className={cls.session}>
                                <span className={cls.time}>{formatTime(s.startsAt)}</span>
                                <span className={cls.sub}>
                                    {s.format} · {s.language}
                                </span>
                                <span className={cls.muted}>
                                    {s.hall} · from {formatPriceRange(s.priceFromCents, s.priceToCents)}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <Link href={`/movies/${movie.id}`} className={cls.cta}>
                        ABOUT THE FILM <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
