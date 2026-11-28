import { mockDelay } from '@/api/mock-delay';
import { mockArchiveMovie, mockImportMovie, mockMovie, mockMovies, mockSaveMovie, mockTmdbSearch } from '@/mocks/admin';
import type { MovieInput } from '@/types/admin.types';

// Admin API (all routes need the admin role). TODO: backend is not connected yet; comments name the real calls.

// Movies: get('/admin/movies'), get(`/admin/movies/${id}`), put/post('/admin/movies'), post(`/admin/movies/${id}/archive`),
// get('/admin/tmdb/search?q='), post('/admin/movies/import', { tmdbId })
export async function getMovies() {
    await mockDelay();
    return mockMovies();
}
export async function getMovie(movieId: string) {
    await mockDelay();
    return mockMovie(movieId);
}
export async function saveMovie({ movieId, input }: { movieId: string | null; input: MovieInput }) {
    await mockDelay(600);
    return mockSaveMovie(movieId, input);
}
export async function archiveMovie(movieId: string) {
    await mockDelay(600);
    return mockArchiveMovie(movieId);
}
export async function searchTmdb(query: string) {
    await mockDelay(300);
    return mockTmdbSearch(query);
}
export async function importMovie(tmdbId: number) {
    await mockDelay(800);
    return mockImportMovie(tmdbId);
}
