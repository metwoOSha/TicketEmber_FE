import { getMockUpcoming } from '@/mocks/movies';
import type { UpcomingMovie } from '@/types/movie.types';

// TODO: backend is not connected yet. Replace with get<UpcomingMovie[]>('/movies/upcoming')
export async function getUpcoming(): Promise<UpcomingMovie[]> {
    return getMockUpcoming();
}

// TODO: patch(`/movies/${id}/notify`, { notify })
export async function setNotify(_params: { id: string; notify: boolean }): Promise<void> {}
