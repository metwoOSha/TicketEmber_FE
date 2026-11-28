'use client';

import { useState } from 'react';
import { useMovie } from '@/hooks/useMovies';
import { hexToRgbString } from '@/utils/format';
import Cast from './Cast/Cast';
import Details from './Details/Details';
import MovieHero from './MovieHero/MovieHero';
import MovieSkeleton from './MovieSkeleton';
import MoreMovies from './MoreMovies/MoreMovies';
import Sessions from './Sessions/Sessions';
import Stills from './Stills/Stills';
import TrailerModal from './TrailerModal';
import cls from './Movie.module.css';

export default function Movie({ id }: { id: string }) {
    const { data: movie, isPending } = useMovie(id);
    const [trailerOpen, setTrailerOpen] = useState(false);

    if (isPending) return <MovieSkeleton />;
    if (!movie) return <p className={cls.missing}>Movie not found.</p>;

    // The page glow is tinted from the poster color
    const glow = hexToRgbString(movie.tint[0]);

    return (
        <div className={cls.page} style={{ '--glow': glow } as React.CSSProperties}>
            <div className={cls.glow} />
            <MovieHero movie={movie} onTrailer={() => setTrailerOpen(true)} />
            <Sessions movieId={movie.id} />
            <Cast cast={movie.cast} tint={movie.tint[0]} />
            <Stills paths={movie.stills} />
            <Details info={movie.info} />
            <MoreMovies excludeId={movie.id} />
            {trailerOpen && <TrailerModal movie={movie} onClose={() => setTrailerOpen(false)} />}
        </div>
    );
}
