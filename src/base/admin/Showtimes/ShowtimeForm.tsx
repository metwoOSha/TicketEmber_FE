'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ApiError } from '@/api/http';
import Card from '@/components/admin/Card/Card';
import { SelectField, TextField } from '@/components/admin/Field/Field';
import Button from '@/components/Button/Button';
import Notice from '@/components/Notice/Notice';
import { CLEANING_MIN, DEFAULT_PRICES, LANGUAGES } from '@/config/admin';
import { useCreateShowtime } from '@/hooks/admin/useAdminData';
import { type ShowtimeValues, showtimeSchema, toCents } from '@/schemas/admin.schema';
import { useAdminUi } from '@/store/admin-ui.store';
import type { AdminMovie, AdminShowtime, Hall, ShowtimeConflict } from '@/types/admin.types';
import { CINEMA_TZ } from '@/utils/format';
import { formatDayLabel } from '@/utils/days';
import type { DraftBlock } from './Timeline';
import cls from './Showtimes.module.css';

type Props = {
    date: string;
    dates: string[];
    movies: AdminMovie[];
    halls: Hall[];
    showtimes: AdminShowtime[];
    onDraft: (draft: DraftBlock | null) => void;
    onDate: (date: string) => void;
};

/** Same rule as the server: the hall must be free for the movie plus cleaning. */
function findConflict(
    values: Pick<ShowtimeValues, 'hallId' | 'date' | 'time'>,
    lengthMin: number,
    showtimes: AdminShowtime[]
): ShowtimeConflict | null {
    if (!/^\d{2}:\d{2}$/.test(values.time)) return null;
    const start = dayjs.tz(`${values.date} ${values.time}`, CINEMA_TZ);
    const end = start.add(lengthMin + CLEANING_MIN, 'minute');
    const clash = showtimes.find(
        (s) =>
            s.hallId === values.hallId &&
            s.status !== 'cancelled' &&
            start.isBefore(dayjs(s.endsAt).add(CLEANING_MIN, 'minute')) &&
            dayjs(s.startsAt).isBefore(end)
    );
    if (!clash) return null;
    const free = dayjs(clash.endsAt).add(CLEANING_MIN, 'minute').tz(CINEMA_TZ);
    return {
        movieTitle: clash.movieTitle,
        from: dayjs(clash.startsAt).tz(CINEMA_TZ).format('HH:mm'),
        to: free.format('HH:mm'),
        nextFree: free.minute(Math.ceil(free.minute() / 5) * 5).format('HH:mm'),
    };
}

export default function ShowtimeForm({ date, dates, movies, halls, showtimes, onDraft, onDate }: Props) {
    const toast = useAdminUi((s) => s.toast);
    const create = useCreateShowtime();
    const playable = movies.filter((m) => m.status !== 'archived');
    const [standard, premium] = DEFAULT_PRICES['2D'];
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors },
    } = useForm<ShowtimeValues>({
        resolver: zodResolver(showtimeSchema),
        defaultValues: {
            movieId: playable[0]?.id ?? '',
            hallId: halls[0]?.id ?? '',
            date,
            time: '20:00',
            format: '2D',
            language: LANGUAGES[0],
            standard: standard / 100,
            premium: premium / 100,
        },
    });
    const values = useWatch({ control });

    const movie = movies.find((m) => m.id === values.movieId);
    const hall = halls.find((h) => h.id === values.hallId);
    const conflict =
        movie && values.hallId && values.date && values.time ? findConflict(values as ShowtimeValues, movie.durationMin, showtimes) : null;
    const start = values.date && values.time ? dayjs.tz(`${values.date} ${values.time}`, CINEMA_TZ) : null;
    const end = start && movie ? start.add(movie.durationMin, 'minute') : null;

    // Show the draft on the schedule while the form is filled in
    const hasConflict = !!conflict;
    useEffect(() => {
        const from = values.date && values.time ? dayjs.tz(`${values.date} ${values.time}`, CINEMA_TZ) : null;
        onDraft(
            movie && from?.isValid() && values.hallId
                ? {
                      hallId: values.hallId,
                      title: movie.title,
                      startsAt: from.toISOString(),
                      endsAt: from.add(movie.durationMin, 'minute').toISOString(),
                      conflict: hasConflict,
                  }
                : null
        );
    }, [movie, values.hallId, values.date, values.time, hasConflict, onDraft]);

    // The form follows the day picked above the schedule (and the schedule follows the form, see the Date field)
    useEffect(() => {
        setValue('date', date);
    }, [date, setValue]);

    // Formats and default prices follow the hall
    useEffect(() => {
        if (!hall) return;
        const format = hall.formats.includes(values.format as ShowtimeValues['format'])
            ? (values.format as ShowtimeValues['format'])
            : hall.formats[0];
        setValue('format', format);
    }, [hall, values.format, setValue]);

    const onSubmit = handleSubmit((v) =>
        create.mutate(
            {
                movieId: v.movieId,
                hallId: v.hallId,
                date: v.date,
                time: v.time,
                format: v.format,
                language: v.language,
                standardCents: toCents(v.standard),
                premiumCents: toCents(v.premium),
            },
            {
                onSuccess: (s) => {
                    toast(`${s.movieTitle} added for ${formatDayLabel(v.date)} at ${v.time}.`);
                    reset({ ...v, time: '' });
                },
            }
        )
    );

    const serverConflict = create.error instanceof ApiError && create.error.status === 409 ? (create.error.body as ShowtimeConflict) : null;
    const shown = conflict ?? serverConflict;

    return (
        <Card title="New showtime" actions={<span className={cls.hint}>Shown as a dashed block on the schedule</span>}>
            <form id="new-showtime" className={cls.form} onSubmit={onSubmit} noValidate>
                <div className={cls.formGrid}>
                    <SelectField label="Movie" error={errors.movieId?.message} {...register('movieId')}>
                        {playable.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.title}, {Math.floor(m.durationMin / 60)}h {m.durationMin % 60}m
                            </option>
                        ))}
                    </SelectField>
                    <SelectField label="Hall" {...register('hallId')}>
                        {halls.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.name}
                            </option>
                        ))}
                    </SelectField>
                    <SelectField
                        label="Date"
                        {...register('date', { onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onDate(e.target.value) })}
                    >
                        {dates.map((d) => (
                            <option key={d} value={d}>
                                {formatDayLabel(d)}
                            </option>
                        ))}
                    </SelectField>
                    <TextField
                        label="Starts at"
                        type="time"
                        step={300}
                        error={errors.time?.message ?? (conflict ? 'Overlaps another showtime' : undefined)}
                        hint={
                            end
                                ? `Ends ${end.tz(CINEMA_TZ).format('HH:mm')}, hall free at ${end.add(CLEANING_MIN, 'minute').tz(CINEMA_TZ).format('HH:mm')}`
                                : undefined
                        }
                        describedBy={shown ? 'showtime-conflict' : undefined}
                        {...register('time')}
                    />
                    <SelectField label="Format" {...register('format')}>
                        {(hall?.formats ?? ['2D']).map((f) => (
                            <option key={f}>{f}</option>
                        ))}
                    </SelectField>
                    <SelectField label="Language" {...register('language')}>
                        {LANGUAGES.map((l) => (
                            <option key={l}>{l}</option>
                        ))}
                    </SelectField>
                    <TextField
                        label="Standard seat, $"
                        type="number"
                        step="0.5"
                        error={errors.standard?.message}
                        {...register('standard', { valueAsNumber: true })}
                    />
                    <TextField
                        label="Premium seat, $"
                        type="number"
                        step="0.5"
                        error={errors.premium?.message}
                        {...register('premium', { valueAsNumber: true })}
                    />
                </div>

                {shown ? (
                    <Notice
                        tone="danger"
                        id="showtime-conflict"
                        action={
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setValue('time', shown.nextFree, { shouldDirty: true })}
                            >
                                Use {shown.nextFree}
                            </Button>
                        }
                    >
                        Overlaps <b>{shown.movieTitle}</b> in {hall?.name} ({shown.from}–{shown.to} with cleaning). The next free start is{' '}
                        {shown.nextFree}.
                    </Notice>
                ) : (
                    end && <Notice tone="success">No overlaps. {hall?.name} is free for this showtime.</Notice>
                )}

                <div className={cls.formActions}>
                    <Button type="button" variant="ghost" size="md" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button type="submit" size="md" disabled={!!conflict} loading={create.isPending}>
                        Create showtime
                    </Button>
                </div>
            </form>
        </Card>
    );
}
