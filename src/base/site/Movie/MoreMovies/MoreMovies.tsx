'use client';

import Link from 'next/link';
import NavLink from '@/components/NavLink/NavLink';
import SectionTitle from '@/components/SectionTitle/SectionTitle';
import { useMoreMovies } from '@/hooks/useMovies';
import { formatDuration } from '@/utils/format';
import { tmdbImage } from '@/utils/tmdb';
import cls from './MoreMovies.module.css';

export default function MoreMovies({ excludeId }: { excludeId: string }) {
    const { data: movies = [] } = useMoreMovies(excludeId);
    if (movies.length === 0) return null;

    return (
        <section className={cls.section}>
            <div className={cls.head}>
                <SectionTitle
                    action={
                        <NavLink href="/" className={cls.all}>
                            All movies →
                        </NavLink>
                    }
                >
                    MORE NOW SHOWING
                </SectionTitle>
            </div>
            <div className={cls.row}>
                {movies.map((movie) => {
                    const poster = tmdbImage(movie.posterPath, 'w500');
                    return (
                        <Link key={movie.id} href={`/movies/${movie.id}`} className={cls.col}>
                            <div
                                className={cls.art}
                                style={{
                                    background: `radial-gradient(ellipse 70% 38% at 50% 30%, ${movie.tint[0]} 0%, transparent 72%), linear-gradient(175deg, ${movie.tint[1]}, #07070a)`,
                                }}
                            >
                                {poster && <img src={poster} alt="" />}
                            </div>
                            <div className={cls.shade} />
                            <div className={cls.info}>
                                <span className={cls.name}>{movie.title}</span>
                                <span className={cls.meta}>
                                    {formatDuration(movie.durationMin)} · {movie.genres[0]}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
