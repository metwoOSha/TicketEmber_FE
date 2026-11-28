import Link from 'next/link';
import Chip from '@/components/Chip/Chip';
import type { MovieDetails } from '@/types/movie.types';
import { formatDuration } from '@/utils/format';
import { tmdbImage } from '@/utils/tmdb';
import cls from './MovieHero.module.css';

type Props = { movie: MovieDetails; onTrailer: () => void };

export default function MovieHero({ movie, onTrailer }: Props) {
    const backdrop = tmdbImage(movie.backdropPath, 'w1280');
    const poster = tmdbImage(movie.posterPath, 'w500');
    const [tint1, tint2] = movie.tint;

    return (
        <section className={cls.hero}>
            {backdrop && (
                <div className={cls.backdrop}>
                    <img src={backdrop} alt="" />
                    <div className={cls.backdropShade} />
                </div>
            )}
            <Link href="/" className={cls.back}>
                ← All movies
            </Link>
            <div className={cls.text}>
                <span className={cls.eyebrow}>NOW SHOWING</span>
                <h1 className={cls.title}>{movie.title}</h1>
                <div className={cls.meta}>
                    <span>{formatDuration(movie.durationMin)}</span>
                    <i>·</i>
                    <span>{movie.year}</span>
                    <i>·</i>
                    <Chip>{movie.ageRating}</Chip>
                    <i>·</i>
                    <span>{movie.genres.join(', ')}</span>
                    <i>·</i>
                    <span className={cls.rating}>★ TMDB {movie.rating.toFixed(1)}</span>
                </div>
                <div className={cls.facts}>
                    <div>
                        <div className={cls.factLabel}>DIRECTOR</div>
                        <div className={cls.factValue}>{movie.director}</div>
                    </div>
                    <div>
                        <div className={cls.factLabel}>ORIGINAL LANGUAGE</div>
                        <div className={cls.factValue}>{movie.originalLanguage}</div>
                    </div>
                </div>
                <p className={cls.overview}>{movie.overview}</p>
                <button type="button" className={cls.trailer} onClick={onTrailer}>
                    <span className={cls.play}>▶</span>WATCH TRAILER
                </button>
            </div>
            <div
                className={cls.poster}
                style={{
                    background: `linear-gradient(175deg, ${tint2}, #07090a)`,
                    boxShadow: `0 50px 90px -30px rgba(var(--glow), 0.7), 0 0 0 1px rgb(244 241 234 / 0.1)`,
                }}
            >
                {poster ? (
                    <img src={poster} alt={`${movie.title} poster`} />
                ) : (
                    <span style={{ background: tint1 }} className={cls.posterGlow} />
                )}
            </div>
        </section>
    );
}
