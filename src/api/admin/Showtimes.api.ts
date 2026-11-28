import { mockDelay } from '@/api/mock-delay';
import {
    mockCancelShowtime,
    mockCreateShowtime,
    mockOrdersOfShowtime,
    mockShowtime,
    mockUpdatePrices,
    showtimeCounts,
    showtimesOn,
} from '@/mocks/admin';
import type { ShowtimeInput } from '@/types/admin.types';

// Admin API (all routes need the admin role). TODO: backend is not connected yet; comments name the real calls.

// Showtimes: get('/admin/showtimes?date='), get(`/admin/showtimes/${id}`), post('/admin/showtimes'),
// patch(`/admin/showtimes/${id}/prices`), post(`/admin/showtimes/${id}/cancel`)
export async function getShowtimes(date: string) {
    await mockDelay();
    return showtimesOn(date);
}
export async function getShowtimeCounts(dates: string[]) {
    await mockDelay(200);
    return showtimeCounts(dates);
}
export async function getShowtime(showtimeId: string) {
    await mockDelay();
    return { showtime: mockShowtime(showtimeId), orders: mockOrdersOfShowtime(showtimeId) };
}
export async function createShowtime(input: ShowtimeInput) {
    await mockDelay(500);
    return mockCreateShowtime(input);
}
export async function updatePrices({
    showtimeId,
    standardCents,
    premiumCents,
}: {
    showtimeId: string;
    standardCents: number;
    premiumCents: number;
}) {
    await mockDelay(500);
    return mockUpdatePrices(showtimeId, standardCents, premiumCents);
}
export async function cancelShowtime(showtimeId: string) {
    await mockDelay(800);
    return mockCancelShowtime(showtimeId);
}
