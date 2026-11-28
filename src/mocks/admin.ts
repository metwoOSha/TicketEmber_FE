import dayjs from 'dayjs';
import { ApiError } from '@/api/http';
import type {
    AdminMovie,
    AdminOrder,
    AdminShowtime,
    DashboardData,
    Hall,
    MovieInput,
    OrderFilter,
    OrderPage,
    Period,
    ScanEntry,
    ShowtimeConflict,
    ShowtimeInput,
    TicketCheck,
    TmdbResult,
} from '@/types/admin.types';
import type { Session } from '@/types/movie.types';
import { CINEMA_TZ } from '@/utils/format';
import { CLEANING_MIN, DEFAULT_PRICES } from '@/config/admin';
import { buildHallLayout, countSeats } from '@/utils/admin-hall';

// In-memory "backend" for the admin. Resets on page reload, like the rest of the mocks.
// TODO: replace with the real endpoints (see api/admin/*).

const PAGE_SIZE = 8;

const today = () => dayjs().tz(CINEMA_TZ).startOf('day');
/** "19:30" on day `offset` -> ISO. Times before 06:00 belong to the next calendar day. */
const at = (time: string, offset = 0) => {
    const [h, m] = time.split(':').map(Number);
    return today()
        .add(offset + (h < 6 ? 1 : 0), 'day')
        .hour(h)
        .minute(m)
        .toISOString();
};
const id = () => crypto.randomUUID();

// ---------------------------------------------------------------- halls

const halls: Hall[] = [
    {
        id: 'small',
        name: 'Small Hall',
        rows: 9,
        cols: 14,
        aisles: [7],
        premiumRows: [],
        sofaRow: { count: 8, aisles: [4] },
        formats: ['2D'],
        overrides: {},
    },
    {
        id: 'big',
        name: 'Big Hall',
        rows: 12,
        cols: 15,
        aisles: [5, 10],
        premiumRows: ['E', 'F', 'G', 'H'],
        sofaRow: null,
        formats: ['2D', '3D'],
        overrides: {},
    },
    {
        id: 'imax',
        name: 'IMAX Hall',
        rows: 15,
        cols: 20,
        aisles: [5, 15],
        premiumRows: ['F', 'G', 'H', 'I', 'J', 'K'],
        sofaRow: null,
        formats: ['IMAX'],
        overrides: {},
    },
];

const hallById = (hallId: string) => {
    const hall = halls.find((h) => h.id === hallId);
    if (!hall) throw new ApiError(404, 'Hall not found');
    return hall;
};

// ---------------------------------------------------------------- movies

const movies: AdminMovie[] = [
    movie('matrix', 'The Matrix', 1999, ['Action', 'Sci-Fi'], 136, '16+', 603, 8.2, 'now', ['#1F7A52', '#0A2A1C']),
    movie('interstellar', 'Interstellar', 2014, ['Sci-Fi', 'Drama'], 169, '12+', 157336, 8.4, 'now', ['#3F63D6', '#101A3E']),
    movie('spirited-away', 'Spirited Away', 2001, ['Animation', 'Fantasy'], 125, '6+', 129, 8.5, 'now', ['#D79A33', '#35220A']),
    movie('parasite', 'Parasite', 2019, ['Thriller', 'Drama'], 132, '18+', 496243, 8.5, 'now', ['#C0406A', '#2E0E1C']),
    {
        ...movie('arrival', 'Arrival', 2016, ['Sci-Fi', 'Drama'], 116, '12+', 329865, 7.6, 'soon', ['#5B8DEF', '#14264D']),
        opensAt: at('00:00', 7),
    },
    {
        ...movie('blade-runner', 'Blade Runner 2049', 2017, ['Sci-Fi', 'Thriller'], 164, '16+', 335984, 7.5, 'soon', [
            '#E08A2E',
            '#4A2208',
        ]),
        opensAt: at('00:00', 14),
    },
    movie('her', 'Her', 2013, ['Romance', 'Drama'], 126, '16+', 152601, 7.8, 'soon', ['#C0406A', '#3A1024']),
    movie('inception', 'Inception', 2010, ['Action', 'Sci-Fi'], 148, '12+', 27205, 8.4, 'archived', ['#2BB3A3', '#0E3B3A']),
    movie('whiplash', 'Whiplash', 2014, ['Drama', 'Music'], 107, '16+', 244786, 8.4, 'archived', ['#A3C94A', '#2B3A10']),
];

function movie(
    movieId: string,
    title: string,
    year: number,
    genres: string[],
    durationMin: number,
    ageRating: string,
    tmdbId: number,
    tmdbRating: number,
    status: AdminMovie['status'],
    tint: [string, string]
): AdminMovie {
    return {
        id: movieId,
        title,
        year,
        genres,
        durationMin,
        ageRating,
        tmdbId,
        tmdbRating,
        status,
        opensAt: null,
        overview: '',
        trailerKey: null,
        originalLanguage: 'English',
        tint,
        lastSyncedAt: dayjs().subtract(3, 'day').toISOString(),
        showtimesThisWeek: 0,
        soldUpcoming: 0,
    };
}

const movieById = (movieId: string) => {
    const found = movies.find((m) => m.id === movieId);
    if (!found) throw new ApiError(404, 'Movie not found');
    return found;
};

// ---------------------------------------------------------------- showtimes

type StoredShowtime = Omit<AdminShowtime, 'movieTitle' | 'tint' | 'hallName' | 'capacity' | 'status' | 'endsAt'> & { cancelled: boolean };

const L = 'Original · UA subs';

// [movie, hall, time, format, language, sold] for today; other days reuse it with fewer seats sold.
const TODAY: [string, string, string, Session['format'], string, number][] = [
    ['spirited-away', 'small', '11:00', '2D', 'UA dub', 88],
    ['matrix', 'big', '12:10', '2D', L, 131],
    ['interstellar', 'imax', '13:00', 'IMAX', L, 244],
    ['parasite', 'small', '14:00', '2D', L, 96],
    ['matrix', 'big', '15:40', '2D', L, 162],
    ['interstellar', 'small', '17:15', '2D', L, 74],
    ['spirited-away', 'big', '19:00', '3D', 'UA dub', 180],
    ['matrix', 'imax', '19:30', 'IMAX', L, 291],
    ['parasite', 'big', '21:45', '2D', L, 63],
    ['matrix', 'imax', '23:55', 'IMAX', L, 41],
];

/** Days 5 and 6 from today are left empty to show the empty day. */
const EMPTY_DAYS = [5, 6];

const showtimes: StoredShowtime[] = [0, 1, 2, 3, 4].flatMap((offset) =>
    TODAY.filter((_, i) => offset === 0 || i % (offset + 1) !== 1).map(([movieId, hallId, time, format, language, sold]) => {
        const [standardCents, premiumCents] = DEFAULT_PRICES[format];
        const soldThatDay = offset === 0 ? sold : Math.round(sold / (offset + 1));
        return {
            id: `${movieId}-${hallId}-${offset}-${time.replace(':', '')}`,
            movieId,
            hallId,
            startsAt: at(time, offset),
            format,
            language,
            sold: soldThatDay,
            standardCents,
            premiumCents,
            paidOrders: Math.round(soldThatDay / 2),
            revenueCents: soldThatDay * standardCents + Math.round(soldThatDay / 5) * (premiumCents - standardCents),
            inside: 0,
            held: [],
            taken: [],
            cancelled: false,
        };
    })
);

function present(s: StoredShowtime): AdminShowtime {
    const m = movieById(s.movieId);
    const hall = hallById(s.hallId);
    const capacity = countSeats(buildHallLayout(hall)).sellable;
    const start = dayjs(s.startsAt);
    const end = start.add(m.durationMin, 'minute');
    const now = dayjs();
    const status: AdminShowtime['status'] = s.cancelled
        ? 'cancelled'
        : end.add(CLEANING_MIN, 'minute').isBefore(now)
          ? 'finished'
          : start.isBefore(now)
            ? 'running'
            : s.sold >= capacity
              ? 'sold-out'
              : capacity - s.sold < 10
                ? 'almost-full'
                : 'on-sale';
    // Doors open 20 minutes before. Mock: most guests are already in, plus the ones admitted on Check-in.
    const doorsOpen = start.subtract(20, 'minute').isBefore(now) && status !== 'finished';
    const inside = (doorsOpen ? Math.round(s.sold * 0.73) : 0) + s.inside;
    return {
        ...s,
        movieTitle: m.title,
        tint: m.tint,
        hallName: hall.name,
        capacity,
        status,
        endsAt: end.toISOString(),
        inside: status === 'cancelled' ? 0 : inside,
        taken: takenSeats(s, hall),
    };
}

/** Stable sold seats for the seat map, spread over the hall. */
function takenSeats(s: StoredShowtime, hall: Hall) {
    const all = buildHallLayout(hall)
        .flatMap((r) => r.seats)
        .filter((seat) => seat.kind !== 'blocked')
        .map((seat) => seat.id);
    // Sold seats exclude held ones; the free ones are at the start of the front row and the end of the back row
    const open = all.filter((seatId) => !s.held.includes(seatId));
    const free = Math.max(0, open.length - s.sold);
    const freeIds = new Set([...open.slice(0, Math.ceil(free / 2)), ...open.slice(open.length - Math.floor(free / 2))]);
    return s.cancelled ? [] : open.filter((seatId) => !freeIds.has(seatId));
}

const showtimeById = (showtimeId: string) => {
    const found = showtimes.find((s) => s.id === showtimeId);
    if (!found) throw new ApiError(404, 'Showtime not found');
    return found;
};

// ---------------------------------------------------------------- orders

const imax1930 = showtimes.find((s) => s.id === 'matrix-imax-0-1930')!;
imax1930.held = ['C5', 'C6'];

const orders: AdminOrder[] = [
    order('94DC0B8C', 'dmytro@example.com', 'matrix-imax-0-1930', ['C5', 'C6'], 'pending', -3, [
        [-3, 'Order created, seats held'],
        [-2, 'Payment declined: test card'],
    ]),
    order('7C21A0F4', 'olena.k@gmail.com', 'interstellar-small-0-1715', ['D4', 'D5', 'D6'], 'paid', -186, [
        [-186, 'Order created, seats held'],
        [-184, 'Paid'],
        [-184, 'Tickets sent'],
    ]),
    order('3F9B22E1', 'max.shev@ukr.net', 'parasite-big-0-2145', ['F1'], 'expired', -208, [
        [-208, 'Order created, seats held'],
        [-193, 'Expired, seats released'],
    ]),
    order('A10C77D2', 'iryna@proton.me', 'spirited-away-big-0-1900', ['H7', 'H8'], 'paid', -217, [
        [-217, 'Order created, seats held'],
        [-215, 'Paid'],
        [-215, 'Tickets sent'],
    ]),
    order('5D3E0A9B', 'taras.b@gmail.com', 'matrix-big-0-1540', ['E9'], 'paid', -260, [
        [-260, 'Order created, seats held'],
        [-258, 'Paid'],
        [-222, 'Ticket scanned at the entrance'],
    ]),
    order('C88F1B04', 'anna.m@gmail.com', 'interstellar-imax-0-1300', ['G10', 'G11'], 'cancelled', -478, [
        [-478, 'Order created, seats held'],
        [-476, 'Paid'],
        [-433, 'Cancelled by customer, refunded'],
    ]),
    order('1B6E9C3A', 'dmytro@example.com', 'parasite-small-0-1400', ['B4', 'B5', 'B6'], 'expired', -511, [
        [-511, 'Order created, seats held'],
        [-496, 'Expired, seats released'],
    ]),
    order('E42A5F70', 'sofia.l@icloud.com', 'matrix-imax-0-1930', ['J12', 'J13', 'J14', 'J15'], 'paid', -543, [
        [-543, 'Order created, seats held'],
        [-539, 'Paid'],
        [-539, 'Tickets sent'],
    ]),
    order('1F04C2B7', 'oleh.p@gmail.com', 'matrix-imax-0-1930', ['G8', 'G9', 'G10'], 'paid', -700, [
        [-700, 'Order created, seats held'],
        [-698, 'Paid'],
    ]),
    order('8B21E0D9', 'kate.r@ukr.net', 'matrix-imax-0-1930', ['M3'], 'paid', -820, [
        [-820, 'Order created, seats held'],
        [-818, 'Paid'],
    ]),
];

function order(
    code: string,
    email: string,
    showtimeId: string,
    seats: string[],
    status: AdminOrder['status'],
    createdMinAgo: number,
    events: [number, string][]
): AdminOrder {
    const s = showtimeById(showtimeId);
    const hall = hallById(s.hallId);
    const premium = new Set(
        buildHallLayout(hall)
            .flatMap((r) => r.seats)
            .filter((seat) => seat.kind !== 'standard')
            .map((seat) => seat.id)
    );
    const totalCents = seats.reduce((sum, seat) => sum + (premium.has(seat) ? s.premiumCents : s.standardCents), 0);
    const createdAt = dayjs().add(createdMinAgo, 'minute');
    return {
        id: code.toLowerCase(),
        code,
        status,
        email,
        showtimeId,
        movieTitle: movieById(s.movieId).title,
        startsAt: s.startsAt,
        hallName: hall.name,
        seats,
        totalCents,
        createdAt: createdAt.toISOString(),
        expiresAt: createdAt.add(15, 'minute').toISOString(),
        payment: status === 'paid' ? 'Test card •••• 4242' : status === 'cancelled' ? 'Refunded' : 'Not paid',
        events: events.map(([min, text]) => ({ at: dayjs().add(min, 'minute').toISOString(), text })),
    };
}

const orderById = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId);
    if (!found) throw new ApiError(404, 'Order not found');
    return found;
};

// ---------------------------------------------------------------- public mock API

export function mockDashboard(period: Period): DashboardData {
    const day = showtimesOn(today().format('YYYY-MM-DD'));
    const scale = { today: 1, week: 6.2, month: 23.8 }[period];
    const revenueCents = Math.round(day.reduce((n, s) => n + s.revenueCents, 0) * scale);
    const ticketsSold = Math.round(day.reduce((n, s) => n + s.sold, 0) * scale);
    const occupancy = Math.round((day.reduce((n, s) => n + s.sold, 0) / day.reduce((n, s) => n + s.capacity, 0)) * 100);
    const pending = orders.filter((o) => o.status === 'pending');
    const almost = day.find((s) => s.status === 'almost-full');
    const soon = movies.find((m) => m.status === 'soon' && m.opensAt);
    const attention: DashboardData['attention'] = [
        ...(almost
            ? [
                  {
                      id: 'almost',
                      level: 'warning' as const,
                      title: `${almost.movieTitle}, ${almost.hallName} ${dayjs(almost.startsAt).tz(CINEMA_TZ).format('HH:mm')}`,
                      text: `Only ${almost.capacity - almost.sold} seats left.`,
                      cta: 'Open showtime',
                      href: `/admin/showtimes/${almost.id}`,
                  },
              ]
            : []),
        ...(pending.length
            ? [
                  {
                      id: 'declined',
                      level: 'problem' as const,
                      title: 'Payment declined',
                      text: `Order ${pending[0].code}. The seats stay held until its timer ends.`,
                      cta: 'Open order',
                      href: `/admin/orders?order=${pending[0].id}`,
                  },
              ]
            : []),
        ...(soon
            ? [
                  {
                      id: 'soon',
                      level: 'info' as const,
                      title: `${soon.title} opens on ${dayjs(soon.opensAt).format('D MMM')}`,
                      text: 'It has no showtimes yet.',
                      cta: 'Add showtimes',
                      href: '/admin/showtimes',
                  },
              ]
            : []),
    ];
    return {
        revenueCents,
        revenueChange: { today: 12, week: 6, month: -3 }[period],
        ticketsSold,
        ticketsChange: { today: 18, week: 71, month: -140 }[period],
        occupancy,
        showtimesCount: Math.round(day.length * scale),
        awaitingPayment: pending.length,
        showtimes: day,
        attention,
        recentOrders: [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
    };
}

export function showtimesOn(date: string): AdminShowtime[] {
    return showtimes
        .filter((s) => dayjs(s.startsAt).tz(CINEMA_TZ).subtract(6, 'hour').format('YYYY-MM-DD') === date)
        .map(present)
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** Count of showtimes per day for the day strip. */
export function showtimeCounts(dates: string[]) {
    return Object.fromEntries(dates.map((d, i) => [d, EMPTY_DAYS.includes(i) ? 0 : showtimesOn(d).length]));
}

export const mockShowtime = (showtimeId: string) => present(showtimeById(showtimeId));

export function mockCreateShowtime(input: ShowtimeInput): AdminShowtime {
    const m = movieById(input.movieId);
    const start = dayjs.tz(`${input.date} ${input.time}`, CINEMA_TZ);
    const end = start.add(m.durationMin + CLEANING_MIN, 'minute');
    const clash = showtimesOn(input.date).find((s) => {
        if (s.hallId !== input.hallId || s.status === 'cancelled') return false;
        const sEnd = dayjs(s.endsAt).add(CLEANING_MIN, 'minute');
        return start.isBefore(sEnd) && dayjs(s.startsAt).isBefore(end);
    });
    if (clash) {
        const free = dayjs(clash.endsAt).add(CLEANING_MIN, 'minute').tz(CINEMA_TZ);
        // Round up to the next 5 minutes
        const nextFree = free.minute(Math.ceil(free.minute() / 5) * 5);
        const body: ShowtimeConflict = {
            movieTitle: clash.movieTitle,
            from: dayjs(clash.startsAt).tz(CINEMA_TZ).format('HH:mm'),
            to: free.format('HH:mm'),
            nextFree: nextFree.format('HH:mm'),
        };
        throw new ApiError(409, `Overlaps ${clash.movieTitle} in ${clash.hallName}`, body);
    }
    const stored: StoredShowtime = {
        id: id(),
        movieId: input.movieId,
        hallId: input.hallId,
        startsAt: start.toISOString(),
        format: input.format,
        language: input.language,
        sold: 0,
        standardCents: input.standardCents,
        premiumCents: input.premiumCents,
        paidOrders: 0,
        revenueCents: 0,
        inside: 0,
        held: [],
        taken: [],
        cancelled: false,
    };
    showtimes.push(stored);
    return present(stored);
}

export function mockUpdatePrices(showtimeId: string, standardCents: number, premiumCents: number) {
    const s = showtimeById(showtimeId);
    Object.assign(s, { standardCents, premiumCents });
    return present(s);
}

export function mockCancelShowtime(showtimeId: string) {
    const s = showtimeById(showtimeId);
    s.cancelled = true;
    for (const o of orders.filter((x) => x.showtimeId === showtimeId)) {
        if (o.status === 'paid' || o.status === 'pending') {
            o.events.push({ at: dayjs().toISOString(), text: o.status === 'paid' ? 'Showtime cancelled, refunded' : 'Showtime cancelled' });
            o.payment = o.status === 'paid' ? 'Refunded' : o.payment;
            o.status = 'cancelled';
        }
    }
    return present(s);
}

export function mockOrders(filter: OrderFilter): OrderPage {
    const q = filter.query.trim().toLowerCase();
    const matching = orders.filter((o) => !q || o.code.toLowerCase().includes(q) || o.email.includes(q));
    const counts = {
        all: matching.length,
        pending: matching.filter((o) => o.status === 'pending').length,
        paid: matching.filter((o) => o.status === 'paid').length,
        expired: matching.filter((o) => o.status === 'expired').length,
        cancelled: matching.filter((o) => o.status === 'cancelled').length,
    };
    const list = matching
        .filter((o) => filter.status === 'all' || o.status === filter.status)
        .sort((a, b) => (filter.sort === 'total' ? b.totalCents - a.totalCents : b.createdAt.localeCompare(a.createdAt)));
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = Math.min(filter.page, pages);
    return { items: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: list.length, page, pages, counts };
}

export const mockOrdersOfShowtime = (showtimeId: string) => orders.filter((o) => o.showtimeId === showtimeId);

export function mockCancelOrder(orderId: string) {
    const o = orderById(orderId);
    if (o.status !== 'paid' && o.status !== 'pending') throw new ApiError(409, 'This order is already closed');
    o.events.push({ at: dayjs().toISOString(), text: o.status === 'paid' ? 'Cancelled by admin, refunded' : 'Cancelled by admin' });
    if (o.status === 'paid') o.payment = 'Refunded';
    o.status = 'cancelled';
    const s = showtimeById(o.showtimeId);
    s.held = s.held.filter((seat) => !o.seats.includes(seat));
    return o;
}

export function mockMovies(): AdminMovie[] {
    const weekEnd = today().add(7, 'day');
    return movies.map((m) => {
        const own = showtimes.filter((s) => s.movieId === m.id && !s.cancelled);
        return {
            ...m,
            showtimesThisWeek: own.filter((s) => dayjs(s.startsAt).isBefore(weekEnd)).length,
            soldUpcoming: own.filter((s) => dayjs(s.startsAt).isAfter(dayjs()) && s.sold > 0).length,
        };
    });
}

export const mockMovie = (movieId: string) => mockMovies().find((m) => m.id === movieId) ?? null;

export function mockSaveMovie(movieId: string | null, input: MovieInput): AdminMovie {
    const genres = input.genres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean);
    if (movieId) {
        const m = movieById(movieId);
        Object.assign(m, { ...input, genres });
        return mockMovie(movieId)!;
    }
    const created: AdminMovie = {
        ...movie(id(), input.title, input.year, genres, input.durationMin, input.ageRating, 0, 0, input.status, ['#8B7BFF', '#17143A']),
        ...input,
        genres,
        tmdbId: null,
        tmdbRating: null,
        lastSyncedAt: null,
    };
    movies.push(created);
    return created;
}

export function mockArchiveMovie(movieId: string) {
    const m = mockMovie(movieId);
    if (!m) throw new ApiError(404, 'Movie not found');
    if (m.soldUpcoming > 0) throw new ApiError(409, `${m.soldUpcoming} upcoming showtimes have sold tickets. Cancel them first.`);
    movieById(movieId).status = 'archived';
    return mockMovie(movieId)!;
}

const TMDB: Omit<TmdbResult, 'added'>[] = [
    { tmdbId: 329865, title: 'Arrival', year: 2016, director: 'Denis Villeneuve', tint: ['#5B8DEF', '#14264D'] },
    { tmdbId: 10357, title: 'Arrival', year: 1996, director: 'David Twohy', tint: ['#6E6B7B', '#1C1C27'] },
    { tmdbId: 438631, title: 'Dune', year: 2021, director: 'Denis Villeneuve', tint: ['#E08A2E', '#4A2208'] },
    { tmdbId: 1124, title: 'The Prestige', year: 2006, director: 'Christopher Nolan', tint: ['#A09DAE', '#22222C'] },
    { tmdbId: 335984, title: 'Blade Runner 2049', year: 2017, director: 'Denis Villeneuve', tint: ['#E08A2E', '#4A2208'] },
];

export function mockTmdbSearch(query: string): TmdbResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TMDB.filter((r) => r.title.toLowerCase().includes(q) || String(r.tmdbId) === q).map((r) => ({
        ...r,
        added: movies.some((m) => m.tmdbId === r.tmdbId),
    }));
}

export function mockImportMovie(tmdbId: number): AdminMovie {
    const r = TMDB.find((x) => x.tmdbId === tmdbId);
    if (!r) throw new ApiError(404, 'Not found on TMDB');
    const created: AdminMovie = {
        ...movie(id(), r.title, r.year, ['Drama'], 120, '12+', r.tmdbId, 7.5, 'soon', r.tint),
        lastSyncedAt: dayjs().toISOString(),
    };
    movies.push(created);
    return created;
}

export const mockHalls = () => halls.map((h) => ({ ...h, overrides: { ...h.overrides } }));

export function mockSaveHall(hall: Hall) {
    const i = halls.findIndex((h) => h.id === hall.id);
    if (i < 0) throw new ApiError(404, 'Hall not found');
    halls[i] = { ...hall, overrides: { ...hall.overrides } };
    return mockHalls()[i];
}

// ---------------------------------------------------------------- check-in

const usedTickets = new Map<string, string>([['5D3E0A9B-01', dayjs().subtract(222, 'minute').toISOString()]]);
const scans: ScanEntry[] = [];

export function mockCheckTicket(ticketId: string, showtimeId: string): TicketCheck {
    const clean = ticketId.trim().toUpperCase();
    const [code, num] = clean.split('-');
    const o = orders.find((x) => x.code === code);
    const seat = o?.seats[Number(num) - 1];
    const empty = {
        seat: null,
        movieTitle: null,
        showtimeId: null,
        startsAt: null,
        hallName: null,
        orderCode: null,
        email: null,
        usedAt: null,
    };
    const result: TicketCheck =
        !o || !seat
            ? { result: 'not-found', ticketId: clean, ...empty }
            : {
                  result:
                      o.status !== 'paid'
                          ? 'unpaid'
                          : usedTickets.has(clean)
                            ? 'used'
                            : showtimeId && o.showtimeId !== showtimeId
                              ? 'wrong-showtime'
                              : 'valid',
                  ticketId: clean,
                  seat,
                  movieTitle: o.movieTitle,
                  showtimeId: o.showtimeId,
                  startsAt: o.startsAt,
                  hallName: o.hallName,
                  orderCode: o.code,
                  email: o.email,
                  usedAt: usedTickets.get(clean) ?? null,
              };
    scans.unshift({ at: dayjs().toISOString(), ticketId: clean, result: result.result });
    return result;
}

export function mockAdmit(ticketId: string, showtimeId: string) {
    const check = mockCheckTicket(ticketId, showtimeId);
    if (check.result !== 'valid') throw new ApiError(409, 'This ticket cannot be used');
    usedTickets.set(check.ticketId, dayjs().toISOString());
    showtimeById(showtimeId).inside += 1;
    scans[0] = { ...scans[0], result: 'checked-in' };
    return { ...check, usedAt: usedTickets.get(check.ticketId)! };
}

export const mockScans = () => scans.slice(0, 6);
