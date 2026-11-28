import dayjs from 'dayjs';
import { getMockMovie, getMockMovies, getMockSessions } from '@/mocks/movies';
import { getHallLayout, HOLD_MINUTES } from '@/utils/hall';
import { ApiError } from '@/api/http';
import type { Order, PayResult, SeatMap } from '@/types/booking.types';
import type { Session } from '@/types/movie.types';

// In-memory "database" for the mocks. Resets on page reload, like the rest of the mock data.

const EMAIL = 'dmytro@example.com';
const orders = new Map<string, Order>();

/** "matrix-2026-11-27-18:00" -> "matrix" */
const movieIdOf = (sessionId: string) => sessionId.replace(/-\d{4}-\d{2}-\d{2}-.*$/, '');

function findSession(sessionId: string): Session | undefined {
    const movieId = movieIdOf(sessionId);
    const date = sessionId.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? '';
    return (
        getMockSessions(movieId).find((s) => s.id === sessionId) ??
        getMockMovies(date)
            .flatMap((m) => m.sessions)
            .find((s) => s.id === sessionId)
    );
}

/** Stable pseudo-random "taken" seats for a session. */
function takenSeats(sessionId: string, hall: string): string[] {
    let seed = sessionId.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
    const next = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 2 ** 32;
    };
    const all = getHallLayout(hall).rows.flatMap((r) => r.seats.map((s) => s.id));
    return all.filter(() => next() < 0.32);
}

const firstLoadAt = Date.now();
/** After 20s the mock "someone else" books E8 and E9, to show the live note. */
const LIVE_SEATS = ['E8', 'E9'];

export function getMockSeatMap(sessionId: string): SeatMap | null {
    const session = findSession(sessionId);
    const movie = getMockMovie(movieIdOf(sessionId));
    if (!session || !movie) return null;

    const taken = takenSeats(sessionId, session.hall).filter((id) => !LIVE_SEATS.includes(id));
    // Seats of orders made in this mock session count as taken too
    for (const o of orders.values())
        if (o.sessionId === sessionId && o.status !== 'cancelled' && o.status !== 'expired') taken.push(...o.seats);
    if (Date.now() - firstLoadAt > 20_000) taken.push(...LIVE_SEATS);

    return {
        sessionId,
        movieId: movie.id,
        movieTitle: movie.title,
        startsAt: session.startsAt,
        hall: session.hall,
        taken,
        standardCents: session.priceFromCents,
        premiumCents: session.priceToCents,
    };
}

function expireIfNeeded(order: Order) {
    if (order.status === 'pending' && dayjs(order.expiresAt).isBefore(dayjs())) order.status = 'expired';
    return order;
}

export function createMockOrder(sessionId: string, seats: string[]): Order {
    const map = getMockSeatMap(sessionId);
    if (!map) throw new ApiError(404, 'Session not found');

    const conflict = seats.find((id) => map.taken.includes(id));
    if (conflict) throw new ApiError(409, `Seat ${conflict} was just booked by someone else.`, { seat: conflict });

    const layout = getHallLayout(map.hall);
    const kind = new Map(layout.rows.flatMap((r) => r.seats).map((s) => [s.id, s.kind]));
    const totalCents = seats.reduce((sum, id) => sum + (kind.get(id) === 'premium' ? map.premiumCents : map.standardCents), 0);
    const movie = getMockMovie(map.movieId);

    const id = crypto.randomUUID();
    const order: Order = {
        id,
        code: id.slice(0, 8).toUpperCase(),
        status: 'pending',
        sessionId,
        movieId: map.movieId,
        movieTitle: map.movieTitle,
        startsAt: map.startsAt,
        hall: map.hall,
        seats: [...seats].sort(),
        totalCents,
        expiresAt: dayjs().add(HOLD_MINUTES, 'minute').toISOString(),
        usedAt: null,
        email: EMAIL,
        tintColor: movie?.tint[0] ?? '#8B7BFF',
    };
    orders.set(id, order);
    return order;
}

export function getMockOrder(id: string): Order | null {
    const order = orders.get(id) ?? SEED.find((o) => o.id === id);
    return order ? expireIfNeeded(order) : null;
}

export function getMockUnpaidOrder(): Order | null {
    return [...orders.values()].map(expireIfNeeded).find((o) => o.status === 'pending') ?? null;
}

export function getMockOrders(): Order[] {
    return [...orders.values(), ...SEED].map(expireIfNeeded).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export function payMockOrder(id: string, fail: boolean): PayResult {
    const order = getMockOrder(id);
    if (!order) throw new ApiError(404, 'Order not found');
    if (order.status === 'expired') return { status: 'expired', order };
    if (fail) return { status: 'declined', order };
    order.status = 'paid';
    return { status: 'paid', order };
}

export function cancelMockOrder(id: string): Order {
    const order = getMockOrder(id);
    if (!order) throw new ApiError(404, 'Order not found');
    if (order.status === 'pending' || order.status === 'paid') order.status = 'cancelled';
    return order;
}

// A few finished orders so "My tickets" is not empty.
function seedOrder(
    id: string,
    movieId: string,
    dayOffset: number,
    time: string,
    hall: string,
    seats: string[],
    status: Order['status']
): Order {
    const movie = getMockMovie(movieId);
    const startsAt = dayjs()
        .tz('Europe/Kyiv')
        .add(dayOffset, 'day')
        .hour(Number(time.slice(0, 2)))
        .minute(Number(time.slice(3)))
        .second(0)
        .toISOString();
    return {
        id,
        code: id.toUpperCase().replace(/-/g, '').slice(0, 8),
        status,
        sessionId: `${movieId}-seed`,
        movieId,
        movieTitle: movie?.title ?? movieId,
        startsAt,
        hall,
        seats,
        totalCents: seats.length * 1000,
        expiresAt: startsAt,
        usedAt: dayOffset < 0 && status === 'paid' ? startsAt : null,
        email: EMAIL,
        tintColor: movie?.tint[0] ?? '#8B7BFF',
    };
}

const SEED: Order[] = [
    seedOrder('seed-up1', 'interstellar', 2, '20:45', 'Small Hall', ['D7', 'D8'], 'paid'),
    seedOrder('seed-up2', 'spirited-away', 5, '16:00', 'Small Hall', ['F3'], 'paid'),
    seedOrder('seed-old1', 'parasite', -9, '21:15', 'Small Hall', ['B4', 'B5', 'B6'], 'paid'),
    seedOrder('seed-old2', 'matrix', -20, '18:00', 'Small Hall', ['C9'], 'cancelled'),
];
