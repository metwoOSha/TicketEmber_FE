import type { Movie, MovieDetails, MovieWithSessions, SearchHit, SearchResults, Session, UpcomingMovie } from '@/types/movie.types';
import { CINEMA_TZ } from '@/utils/format';
import { getNextDays, toStartsAt } from '@/utils/days';
import dayjs from 'dayjs';

// Temporary data until the backend is connected. Prices are USD cents.
const MOVIES: (Movie & { times: [time: string, format: Session['format'], language: string, hall: string][] })[] = [
    {
        id: 'matrix',
        title: 'The Matrix',
        genres: ['Action', 'Sci-Fi'],
        durationMin: 136,
        rating: 8.2,
        posterPath: null,
        tint: ['#1F7A52', '#0A2A1C'],
        times: [
            ['18:00', '2D', 'Original · UA subs', 'Small Hall'],
            ['19:30', 'IMAX', 'Original · UA subs', 'IMAX Hall'],
            ['23:55', '2D', 'Original · UA subs', 'Small Hall'],
        ],
    },
    {
        id: 'interstellar',
        title: 'Interstellar',
        genres: ['Sci-Fi', 'Drama'],
        durationMin: 169,
        rating: 8.4,
        posterPath: null,
        tint: ['#3F63D6', '#101A3E'],
        times: [
            ['17:15', '2D', 'Original · UA subs', 'Small Hall'],
            ['20:45', '2D', 'UA dub', 'Small Hall'],
        ],
    },
    {
        id: 'spirited-away',
        title: 'Spirited Away',
        genres: ['Animation', 'Fantasy'],
        durationMin: 125,
        rating: 8.5,
        posterPath: null,
        tint: ['#D79A33', '#35220A'],
        times: [
            ['16:00', '2D', 'UA dub', 'Small Hall'],
            ['19:00', '2D', 'Original · UA subs', 'Small Hall'],
        ],
    },
    {
        id: 'parasite',
        title: 'Parasite',
        genres: ['Thriller', 'Drama'],
        durationMin: 132,
        rating: 8.5,
        posterPath: null,
        tint: ['#C0406A', '#2E0E1C'],
        times: [
            ['18:30', '2D', 'Original · UA subs', 'Small Hall'],
            ['21:15', '2D', 'Original · UA subs', 'Small Hall'],
        ],
    },
    {
        id: 'blade-runner-2049',
        title: 'Blade Runner 2049',
        genres: ['Sci-Fi', 'Mystery'],
        durationMin: 164,
        rating: 7.5,
        posterPath: null,
        tint: ['#E2602F', '#2E140A'],
        times: [['19:30', '2D', 'Original · UA subs', 'Small Hall']],
    },
];

const HALLS = { 'Small Hall': 120, 'Big Hall': 180, 'IMAX Hall': 300 } as const;
const PRICE: Record<Session['format'], [number, number]> = { '2D': [800, 1200], '3D': [1000, 1400], IMAX: [1200, 1600] };

function makeSession(
    movie: Movie,
    date: string,
    time: string,
    format: Session['format'],
    language: string,
    hall: keyof typeof HALLS,
    seatsFree: number
): Session {
    const startsAt = toStartsAt(date, time);
    const [priceFromCents, priceToCents] = PRICE[format];
    return {
        id: `${movie.id}-${date}-${time}`,
        movieId: movie.id,
        startsAt,
        endsAt: dayjs(startsAt)
            .add(movie.durationMin + 20, 'minute')
            .toISOString(),
        format,
        language,
        hall,
        seatsFree,
        seatsTotal: HALLS[hall],
        priceFromCents,
        priceToCents,
    };
}

export function getMockMovies(date: string): MovieWithSessions[] {
    return MOVIES.map(({ times, ...movie }) => ({
        ...movie,
        sessions: times.map(([time, format, language, hall]) =>
            makeSession(movie, date, time, format, language, hall as keyof typeof HALLS, 40)
        ),
    }));
}

/** Days 3, 8 and 11 from today have no sessions, to show the empty state. */
const NO_SESSIONS = [3, 8, 11];

export function getMockSessions(movieId: string): Session[] {
    const movie = MOVIES.find((m) => m.id === movieId);
    if (!movie) return [];
    const L = 'Original · UA subs';
    return getNextDays(14).flatMap((date, k) => {
        if (NO_SESSIONS.includes(k)) return [];
        if (k === 0) {
            return [
                makeSession(movie, date, '12:10', '2D', 'UA dub', 'Small Hall', 0),
                makeSession(movie, date, '15:40', '2D', L, 'Big Hall', 0),
                makeSession(movie, date, '18:00', '2D', L, 'Small Hall', 48),
                makeSession(movie, date, '19:30', 'IMAX', L, 'IMAX Hall', 7),
                makeSession(movie, date, '21:15', '3D', 'UA dub', 'Big Hall', 0),
                makeSession(movie, date, '23:55', '2D', L, 'Small Hall', 52),
            ];
        }
        return [
            makeSession(movie, date, '11:00', '2D', 'UA dub', 'Small Hall', 60 + k),
            makeSession(movie, date, '14:20', '3D', L, 'Big Hall', 88 - k),
            makeSession(movie, date, '18:00', 'IMAX', L, 'IMAX Hall', k % 2 ? 4 : 120),
            makeSession(movie, date, '21:30', '2D', L, 'Small Hall', k % 3 ? 31 : 0),
        ];
    });
}

export function getMockMovie(id: string): MovieDetails | null {
    const movie = MOVIES.find((m) => m.id === id);
    if (!movie) return null;
    const { times: _times, ...base } = movie;
    return {
        ...base,
        year: 1999,
        ageRating: '16+',
        director: 'Lana & Lilly Wachowski',
        originalLanguage: 'English',
        overview:
            'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        backdropPath: null,
        trailerKey: null,
        cast: [
            { name: 'Keanu Reeves', role: 'Neo', profilePath: null },
            { name: 'Laurence Fishburne', role: 'Morpheus', profilePath: null },
            { name: 'Carrie-Anne Moss', role: 'Trinity', profilePath: null },
            { name: 'Hugo Weaving', role: 'Agent Smith', profilePath: null },
            { name: 'Joe Pantoliano', role: 'Cypher', profilePath: null },
            { name: 'Gloria Foster', role: 'The Oracle', profilePath: null },
        ],
        stills: [],
        info: [
            { label: 'ORIGINAL TITLE', value: base.title },
            { label: 'COUNTRY', value: 'USA, Australia' },
            { label: 'LANGUAGE', value: 'English' },
            { label: 'DISTRIBUTOR', value: 'Warner Bros.' },
            { label: 'RELEASE DATE', value: '31 Mar 1999' },
            { label: 'AGE RATING', value: '16+' },
        ],
    };
}

export const getMockMoreMovies = (excludeId: string): Movie[] =>
    MOVIES.filter((m) => m.id !== excludeId).map(({ times: _times, ...movie }) => movie);

const UPCOMING: UpcomingMovie[] = [
    {
        id: 'jumanji-3',
        title: 'Jumanji 3',
        meta: 'Adventure · Comedy · 2h 4m',
        kicker: 'RELEASE',
        releaseDate: '2026-12-11',
        tint: ['#2B8F6B', '#06130E'],
        notify: true,
    },
    {
        id: 'matrix-resurrections',
        title: 'The Matrix Resurrections',
        meta: 'Re-release · Sci-Fi · 2h 28m',
        kicker: 'BACK IN CINEMAS',
        releaseDate: '2026-12-12',
        tint: ['#1F7A52', '#050507'],
        notify: false,
    },
    {
        id: 'dune-3',
        title: 'Dune: Part Three',
        meta: 'Sci-Fi · Drama · 2h 40m',
        kicker: 'RELEASE',
        releaseDate: '2026-12-18',
        tint: ['#B8742A', '#120A04'],
        notify: false,
    },
    {
        id: 'avengers-doomsday',
        title: 'Avengers: Doomsday',
        meta: 'Action · Sci-Fi · 2h 30m',
        kicker: 'RELEASE',
        releaseDate: '2026-12-18',
        tint: ['#3F63D6', '#070B1A'],
        notify: false,
    },
];

export const getMockUpcoming = (): UpcomingMovie[] => UPCOMING.map((m) => ({ ...m }));

export function searchMock(query: string): SearchResults {
    const q = query.trim().toLowerCase();
    if (!q) return { nowShowing: [], comingSoon: [] };
    const nowShowing = MOVIES.filter((m) => m.title.toLowerCase().includes(q)).map((m): SearchHit => ({
        id: m.id,
        title: m.title,
        posterPath: m.posterPath,
        tint: m.tint,
        meta: `${m.genres.join(', ')} · ${Math.floor(m.durationMin / 60)}h ${m.durationMin % 60}m`,
        note: `Today · ${m.times.map(([t]) => t).join(', ')}`,
    }));
    const comingSoon = UPCOMING.filter((m) => m.title.toLowerCase().includes(q)).map((m): SearchHit => ({
        id: m.id,
        title: m.title,
        posterPath: null,
        tint: m.tint,
        meta: m.meta,
        note: `${m.kicker === 'RELEASE' ? 'Release' : 'Back in cinemas'} ${dayjs.tz(m.releaseDate, CINEMA_TZ).format('ddd D MMM')}`,
    }));
    return { nowShowing, comingSoon };
}
