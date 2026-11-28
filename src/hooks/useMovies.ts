'use client';

import { useQuery } from '@tanstack/react-query';
import { getMovie, getMoreMovies, getMovieSessions, getMovies } from '@/api/Movies.api';

/** Movies that play on the given "YYYY-MM-DD" day, with their sessions. */
export function useMovies(date: string) {
    return useQuery({ queryKey: ['movies', date], queryFn: () => getMovies(date) });
}

export function useMovie(id: string) {
    return useQuery({ queryKey: ['movie', id], queryFn: () => getMovie(id) });
}

export function useMovieSessions(movieId: string) {
    return useQuery({ queryKey: ['movie-sessions', movieId], queryFn: () => getMovieSessions(movieId) });
}

export function useMoreMovies(excludeId: string) {
    return useQuery({ queryKey: ['more-movies', excludeId], queryFn: () => getMoreMovies(excludeId) });
}
