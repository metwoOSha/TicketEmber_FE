export type Session = {
    id: string;
    movieId: string;
    /** ISO strings, shown in cinema time (see utils/format) */
    startsAt: string;
    endsAt: string;
    format: '2D' | '3D' | 'IMAX';
    language: string;
    hall: string;
    seatsFree: number;
    seatsTotal: number;
    /** USD cents */
    priceFromCents: number;
    priceToCents: number;
};

export type Movie = {
    id: string;
    title: string;
    genres: string[];
    durationMin: number;
    rating: number;
    /** TMDB poster_path; null -> gradient only */
    posterPath: string | null;
    /** Two tint colors used behind the poster */
    tint: [string, string];
};

export type MovieWithSessions = Movie & { sessions: Session[] };

export type CastMember = { name: string; role: string; profilePath: string | null };

export type MovieDetails = Movie & {
    year: number;
    ageRating: string;
    director: string;
    originalLanguage: string;
    overview: string;
    backdropPath: string | null;
    trailerKey: string | null;
    cast: CastMember[];
    /** TMDB backdrop paths */
    stills: string[];
    info: { label: string; value: string }[];
};

export type SessionStatus = 'ok' | 'almost' | 'sold' | 'started';

export type UpcomingMovie = {
    id: string;
    title: string;
    /** "Adventure · Comedy · 2h 4m" */
    meta: string;
    /** "Release" or "Back in cinemas" */
    kicker: string;
    /** ISO date */
    releaseDate: string;
    tint: [string, string];
    notify: boolean;
};

export type SearchHit = {
    id: string;
    title: string;
    posterPath: string | null;
    tint: [string, string];
    /** "1999 · Sci-fi · 2h 16m" */
    meta: string;
    /** "Today · 18:00, 19:30" or "Back in cinemas Sat 12 Dec" */
    note: string;
};

export type SearchResults = { nowShowing: SearchHit[]; comingSoon: SearchHit[] };
