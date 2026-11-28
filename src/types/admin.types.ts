import type { OrderStatus } from '@/types/booking.types';
import type { Session } from '@/types/movie.types';

/** Colour of a status badge. Text always says the status too. */
export type Tone = 'ok' | 'warn' | 'bad' | 'mute' | 'info';

export type Period = 'today' | 'week' | 'month';

// ---- Halls ----

export type SeatKind = 'standard' | 'premium' | 'sofa' | 'blocked';

export type Hall = {
    id: string;
    name: string;
    rows: number;
    cols: number;
    /** Seat numbers an aisle comes after, per row */
    aisles: number[];
    premiumRows: string[];
    /** The last row can be a row of sofas for two */
    sofaRow: { count: number; aisles: number[] } | null;
    formats: Session['format'][];
    /** Seats painted by hand: "C7" -> "blocked" */
    overrides: Record<string, SeatKind>;
};

export type HallSeat = { id: string; num: number; kind: SeatKind };
export type HallRowLayout = { name: string; aisles: number[]; seats: HallSeat[] };

// ---- Movies ----

export type MovieStatus = 'now' | 'soon' | 'archived';

export type AdminMovie = {
    id: string;
    title: string;
    year: number;
    genres: string[];
    durationMin: number;
    ageRating: string;
    tmdbId: number | null;
    tmdbRating: number | null;
    status: MovieStatus;
    /** ISO date the movie opens, for "Coming soon" */
    opensAt: string | null;
    overview: string;
    trailerKey: string | null;
    originalLanguage: string;
    tint: [string, string];
    lastSyncedAt: string | null;
    showtimesThisWeek: number;
    /** Upcoming showtimes that already sold tickets: the movie can't be archived while > 0 */
    soldUpcoming: number;
};

export type MovieInput = Pick<
    AdminMovie,
    'title' | 'durationMin' | 'year' | 'ageRating' | 'status' | 'overview' | 'trailerKey' | 'originalLanguage'
> & {
    genres: string;
};

export type TmdbResult = { tmdbId: number; title: string; year: number; director: string; tint: [string, string]; added: boolean };

// ---- Showtimes ----

export type ShowtimeStatus = 'finished' | 'running' | 'on-sale' | 'almost-full' | 'sold-out' | 'cancelled';

export type AdminShowtime = {
    id: string;
    movieId: string;
    movieTitle: string;
    tint: [string, string];
    /** ISO strings, shown in cinema time */
    startsAt: string;
    endsAt: string;
    hallId: string;
    hallName: string;
    format: Session['format'];
    language: string;
    sold: number;
    capacity: number;
    status: ShowtimeStatus;
    standardCents: number;
    premiumCents: number;
    paidOrders: number;
    revenueCents: number;
    inside: number;
    /** Seats of unpaid orders */
    held: string[];
    taken: string[];
};

export type ShowtimeInput = {
    movieId: string;
    hallId: string;
    /** "YYYY-MM-DD" */
    date: string;
    /** "HH:mm" */
    time: string;
    format: Session['format'];
    language: string;
    standardCents: number;
    premiumCents: number;
};

/** 409 body when a new showtime overlaps another one in the same hall */
export type ShowtimeConflict = { movieTitle: string; from: string; to: string; nextFree: string };

// ---- Orders ----

export type AdminOrder = {
    id: string;
    code: string;
    status: OrderStatus;
    email: string;
    showtimeId: string;
    movieTitle: string;
    startsAt: string;
    hallName: string;
    seats: string[];
    totalCents: number;
    createdAt: string;
    expiresAt: string;
    payment: string;
    events: { at: string; text: string }[];
};

export type OrderFilter = { status: OrderStatus | 'all'; query: string; sort: 'created' | 'total'; page: number };
export type OrderPage = { items: AdminOrder[]; total: number; page: number; pages: number; counts: Record<OrderStatus | 'all', number> };

// ---- Dashboard ----

export type AttentionItem = { id: string; level: 'warning' | 'problem' | 'info'; title: string; text: string; cta: string; href: string };

export type DashboardData = {
    revenueCents: number;
    revenueChange: number;
    ticketsSold: number;
    ticketsChange: number;
    occupancy: number;
    showtimesCount: number;
    awaitingPayment: number;
    showtimes: AdminShowtime[];
    attention: AttentionItem[];
    recentOrders: AdminOrder[];
};

// ---- Check-in ----

export type CheckResult = 'valid' | 'used' | 'wrong-showtime' | 'unpaid' | 'not-found';

export type TicketCheck = {
    result: CheckResult;
    ticketId: string;
    seat: string | null;
    movieTitle: string | null;
    showtimeId: string | null;
    startsAt: string | null;
    hallName: string | null;
    orderCode: string | null;
    email: string | null;
    usedAt: string | null;
};

export type ScanEntry = { at: string; ticketId: string; result: CheckResult | 'checked-in' };
