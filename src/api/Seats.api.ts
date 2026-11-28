import { getMockSeatMap } from '@/mocks/orders';
import type { SeatMap } from '@/types/booking.types';

// TODO: backend is not connected yet: get<SeatMap>(`/sessions/${sessionId}/seats`)
export async function getSeatMap(sessionId: string): Promise<SeatMap | null> {
    return getMockSeatMap(sessionId);
}
