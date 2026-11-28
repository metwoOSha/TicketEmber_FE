import type { Session } from '@/types/movie.types';

/** Minutes the hall needs between two showtimes */
export const CLEANING_MIN = 20;

/** Default seat prices per format, USD cents: [standard, premium] */
export const DEFAULT_PRICES: Record<Session['format'], [number, number]> = { '2D': [800, 1200], '3D': [1000, 1400], IMAX: [1200, 1600] };

export const LANGUAGES = ['Original · UA subs', 'UA dub'];

/** The schedule shows 10:00 to 03:00 of the next day */
export const TIMELINE_FROM_HOUR = 10;
export const TIMELINE_HOURS = 17;
