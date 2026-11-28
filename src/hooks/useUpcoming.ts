'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUpcoming, setNotify } from '@/api/Upcoming.api';
import type { UpcomingMovie } from '@/types/movie.types';

const KEY = ['upcoming'];

export function useUpcoming() {
    return useQuery({ queryKey: KEY, queryFn: getUpcoming });
}

/** Toggles "notify me" with an optimistic update. */
export function useNotify() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setNotify,
        onMutate: ({ id, notify }) => {
            queryClient.setQueryData<UpcomingMovie[]>(KEY, (list) => list?.map((m) => (m.id === id ? { ...m, notify } : m)));
        },
        onError: () => queryClient.invalidateQueries({ queryKey: KEY }),
    });
}
