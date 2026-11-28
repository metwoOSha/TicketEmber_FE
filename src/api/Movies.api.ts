import { getMockMovie, getMockMoreMovies, getMockMovies, getMockSessions } from '@/mocks/movies';
import type { Movie, MovieDetails, MovieWithSessions, Session } from '@/types/movie.types';

// TODO: backend is not connected yet. Replace each body with the matching call, e.g.
// get<MovieWithSessions[]>(`/movies?date=${date}`)
export async function getMovies(date: string): Promise<MovieWithSessions[]> {
    return getMockMovies(date);
}

export async function getMovie(id: string): Promise<MovieDetails | null> {
    return getMockMovie(id);
}

/** All upcoming sessions of a movie; the page groups them by day. */
export async function getMovieSessions(movieId: string): Promise<Session[]> {
    return getMockSessions(movieId);
}

export async function getMoreMovies(excludeId: string): Promise<Movie[]> {
    return getMockMoreMovies(excludeId);
}
