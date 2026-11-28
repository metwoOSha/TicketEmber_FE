'use client';

import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '@/api/Search.api';
import { useDebounced } from '@/hooks/useDebounced';

/** Search with a small debounce so we do not query on every keystroke. */
export function useSearch(query: string) {
    const debounced = useDebounced(query);

    return useQuery({
        queryKey: ['search', debounced],
        queryFn: () => searchMovies(debounced),
        enabled: debounced.trim().length > 0,
    });
}
