'use client';

import { useQuery } from '@tanstack/react-query';
import { getSeatMap } from '@/api/Seats.api';

/** Seat map of a session. Polls so seats taken by others show up (real-time later). */
export function useSeatMap(sessionId: string) {
    return useQuery({ queryKey: ['seat-map', sessionId], queryFn: () => getSeatMap(sessionId), refetchInterval: 5000 });
}
