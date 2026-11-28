import { z } from 'zod';

const minutes = z.number({ error: 'Enter a number' }).int('Whole minutes only').min(1, 'Must be more than 0').max(600, 'Too long');
const dollars = z.number({ error: 'Enter a price' }).min(1, 'At least $1').max(100, 'At most $100');

export const AGE_RATINGS = ['0+', '6+', '12+', '16+', '18+'] as const;

export const movieSchema = z.object({
    title: z.string().trim().min(1, 'Enter a title'),
    durationMin: minutes,
    year: z.number({ error: 'Enter a year' }).int().min(1888, 'Too early').max(2100, 'Too late'),
    ageRating: z.enum(AGE_RATINGS),
    status: z.enum(['now', 'soon', 'archived']),
    genres: z.string().trim().min(1, 'Add at least one genre'),
    overview: z.string().trim(),
    trailerKey: z.string().trim().nullable(),
    originalLanguage: z.string().trim().min(1, 'Enter a language'),
});
export type MovieValues = z.infer<typeof movieSchema>;

export const pricesSchema = z
    .object({ standard: dollars, premium: dollars })
    .refine((v) => v.premium >= v.standard, { path: ['premium'], message: 'Premium should not be cheaper than standard' });
export type PricesValues = z.infer<typeof pricesSchema>;

export const showtimeSchema = z
    .object({
        movieId: z.string().min(1, 'Pick a movie'),
        hallId: z.string().min(1, 'Pick a hall'),
        date: z.string().min(1, 'Pick a date'),
        time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:mm, e.g. 20:30'),
        format: z.enum(['2D', '3D', 'IMAX']),
        language: z.string().min(1),
    })
    .and(pricesSchema);
export type ShowtimeValues = z.infer<typeof showtimeSchema>;

/** Dollars from a form -> cents for the API */
export const toCents = (dollarsValue: number) => Math.round(dollarsValue * 100);
