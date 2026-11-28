import { searchMock } from '@/mocks/movies';
import type { SearchResults } from '@/types/movie.types';

// TODO: backend is not connected yet. Replace with: get<SearchResults>(`/search?q=${encodeURIComponent(query)}`)
export async function searchMovies(query: string): Promise<SearchResults> {
    return searchMock(query);
}
