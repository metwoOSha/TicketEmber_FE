'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admitTicket, checkTicket, getScans } from '@/api/admin/CheckIn.api';
import { getDashboard } from '@/api/admin/Dashboard.api';
import { getHalls, saveHall } from '@/api/admin/Halls.api';
import { archiveMovie, getMovie, getMovies, importMovie, saveMovie, searchTmdb } from '@/api/admin/Movies.api';
import { cancelOrder, getOrders } from '@/api/admin/Orders.api';
import { cancelShowtime, createShowtime, getShowtime, getShowtimeCounts, getShowtimes, updatePrices } from '@/api/admin/Showtimes.api';
import type { OrderFilter, Period } from '@/types/admin.types';

// Everything in the admin lives under the ['admin'] key, so any change refreshes the screens that show it.
const KEY = 'admin';

/** Mutation that refreshes all admin data when it succeeds. */
function useAdminMutation<TVars, TData>(mutationFn: (vars: TVars) => Promise<TData>) {
    const queryClient = useQueryClient();
    return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }) });
}

export const useDashboard = (period: Period) =>
    useQuery({ queryKey: [KEY, 'dashboard', period], queryFn: () => getDashboard(period), placeholderData: keepPreviousData });

export const useAdminOrders = (filter: OrderFilter) =>
    useQuery({ queryKey: [KEY, 'orders', filter], queryFn: () => getOrders(filter), placeholderData: keepPreviousData });
export const useCancelOrder = () => useAdminMutation(cancelOrder);

export const useAdminMovies = () => useQuery({ queryKey: [KEY, 'movies'], queryFn: getMovies });
export const useAdminMovie = (movieId: string | null) =>
    useQuery({ queryKey: [KEY, 'movie', movieId], queryFn: () => getMovie(movieId!), enabled: !!movieId });
export const useSaveMovie = () => useAdminMutation(saveMovie);
export const useArchiveMovie = () => useAdminMutation(archiveMovie);
export const useImportMovie = () => useAdminMutation(importMovie);
export const useTmdbSearch = (query: string) =>
    useQuery({ queryKey: [KEY, 'tmdb', query], queryFn: () => searchTmdb(query), enabled: query.trim().length > 1 });

export const useShowtimes = (date: string) => useQuery({ queryKey: [KEY, 'showtimes', date], queryFn: () => getShowtimes(date) });
export const useShowtimeCounts = (dates: string[]) =>
    useQuery({ queryKey: [KEY, 'showtime-counts', dates], queryFn: () => getShowtimeCounts(dates) });
export const useShowtime = (showtimeId: string) =>
    useQuery({ queryKey: [KEY, 'showtime', showtimeId], queryFn: () => getShowtime(showtimeId), refetchInterval: 15_000 });
export const useCreateShowtime = () => useAdminMutation(createShowtime);
export const useUpdatePrices = () => useAdminMutation(updatePrices);
export const useCancelShowtime = () => useAdminMutation(cancelShowtime);

export const useHalls = () => useQuery({ queryKey: [KEY, 'halls'], queryFn: getHalls });
export const useSaveHall = () => useAdminMutation(saveHall);

export const useCheckTicket = () => useAdminMutation(checkTicket);
export const useAdmitTicket = () => useAdminMutation(admitTicket);
export const useScans = () => useQuery({ queryKey: [KEY, 'scans'], queryFn: getScans });
