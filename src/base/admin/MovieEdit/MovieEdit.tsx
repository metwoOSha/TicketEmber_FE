'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/api/http';
import Card from '@/components/admin/Card/Card';
import ConfirmDialog from '@/components/admin/Dialog/ConfirmDialog';
import { SelectField, TextAreaField, TextField } from '@/components/admin/Field/Field';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import Poster from '@/components/admin/Poster/Poster';
import Button from '@/components/Button/Button';
import Chip from '@/components/Chip/Chip';
import Icon from '@/components/Icon/Icon';
import Notice from '@/components/Notice/Notice';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAdminMovie, useArchiveMovie, useSaveMovie } from '@/hooks/admin/useAdminData';
import { AGE_RATINGS, type MovieValues, movieSchema } from '@/schemas/admin.schema';
import { useAdminUi } from '@/store/admin-ui.store';
import type { AdminMovie } from '@/types/admin.types';
import cls from './MovieEdit.module.css';

const EMPTY: MovieValues = {
    title: '',
    durationMin: 120,
    year: dayjs().year(),
    ageRating: '12+',
    status: 'soon',
    genres: '',
    overview: '',
    trailerKey: null,
    originalLanguage: 'English',
};

const toValues = (m: AdminMovie): MovieValues => ({
    title: m.title,
    durationMin: m.durationMin,
    year: m.year,
    ageRating: (AGE_RATINGS as readonly string[]).includes(m.ageRating) ? (m.ageRating as MovieValues['ageRating']) : '12+',
    status: m.status,
    genres: m.genres.join(', '),
    overview: m.overview,
    trailerKey: m.trailerKey,
    originalLanguage: m.originalLanguage,
});

/** Edit a movie; `id === 'new'` adds one by hand. */
export default function MovieEdit({ id }: { id: string }) {
    const isNew = id === 'new';
    const { data: movie, isPending } = useAdminMovie(isNew ? null : id);

    if (!isNew && isPending) return <Skeleton height={600} radius={10} />;
    if (!isNew && !movie)
        return (
            <p>
                Movie not found. <Link href="/admin/movies">Back to movies</Link>
            </p>
        );
    return <MovieForm movie={isNew ? null : movie!} />;
}

function MovieForm({ movie }: { movie: AdminMovie | null }) {
    const router = useRouter();
    const toast = useAdminUi((s) => s.toast);
    const save = useSaveMovie();
    const archive = useArchiveMovie();
    const [confirmArchive, setConfirmArchive] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<MovieValues>({ resolver: zodResolver(movieSchema), defaultValues: movie ? toValues(movie) : EMPTY });

    // Ask before leaving with unsaved edits
    useEffect(() => {
        if (!isDirty) return;
        const warn = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [isDirty]);

    const onSubmit = handleSubmit((values) =>
        save.mutate(
            { movieId: movie?.id ?? null, input: { ...values, trailerKey: values.trailerKey || null } },
            {
                onSuccess: (saved) => {
                    reset(toValues(saved));
                    toast(movie ? 'Changes saved.' : `${saved.title} added.`);
                    if (!movie) router.replace(`/admin/movies/${saved.id}`);
                },
            }
        )
    );

    const tmdb = (label: string) => (
        <>
            {label} {movie?.tmdbId && <Chip className={cls.tmdb}>TMDB</Chip>}
        </>
    );
    const canArchive = !!movie && movie.status !== 'archived' && movie.soldUpcoming === 0;

    return (
        <form onSubmit={onSubmit} noValidate className={cls.form}>
            <PageHeader
                back={{ href: '/admin/movies', label: 'Movies' }}
                title={movie?.title ?? 'New movie'}
                sub={
                    movie?.tmdbId
                        ? `TMDB ${movie.tmdbId}, last synced ${dayjs(movie.lastSyncedAt).format('D MMM, HH:mm')}`
                        : 'Added by hand, not linked to TMDB'
                }
                actions={
                    movie?.tmdbId ? (
                        // TODO: POST /admin/movies/:id/sync
                        <Button type="button" variant="ghost" size="md" onClick={() => toast('Synced from TMDB.')}>
                            <Icon name="refresh" size={16} />
                            Sync from TMDB
                        </Button>
                    ) : undefined
                }
            />

            <div className={cls.cols}>
                <div className={cls.main}>
                    <Card
                        title="Basics"
                        actions={movie?.tmdbId ? <span className={cls.hint}>Fields marked TMDB are overwritten on sync</span> : undefined}
                    >
                        <div className={cls.grid}>
                            <TextField className={cls.full} label="Title" error={errors.title?.message} {...register('title')} />
                            <TextField
                                label={tmdb('Length, min')}
                                type="number"
                                error={errors.durationMin?.message}
                                {...register('durationMin', { valueAsNumber: true })}
                            />
                            <TextField
                                label={tmdb('Release year')}
                                type="number"
                                error={errors.year?.message}
                                {...register('year', { valueAsNumber: true })}
                            />
                            <SelectField label="Age rating" error={errors.ageRating?.message} {...register('ageRating')}>
                                {AGE_RATINGS.map((a) => (
                                    <option key={a}>{a}</option>
                                ))}
                            </SelectField>
                            <SelectField label="Status" hint="Only Now showing movies appear on the main page." {...register('status')}>
                                <option value="now">Now showing</option>
                                <option value="soon">Coming soon</option>
                                <option value="archived" disabled={!canArchive && movie?.status !== 'archived'}>
                                    Archived
                                </option>
                            </SelectField>
                            <TextField
                                className={cls.full}
                                label={tmdb('Genres')}
                                hint="Comma separated"
                                error={errors.genres?.message}
                                {...register('genres')}
                            />
                            <TextAreaField className={cls.full} label={tmdb('Overview')} {...register('overview')} />
                            <TextField label="Trailer, YouTube key" {...register('trailerKey')} />
                            <TextField
                                label="Original language"
                                error={errors.originalLanguage?.message}
                                {...register('originalLanguage')}
                            />
                        </div>
                    </Card>

                    {movie && movie.status !== 'archived' && (
                        <Card title="Archive">
                            <div className={cls.archive}>
                                <p>
                                    Archived movies disappear from the site. You can archive a movie only when it has no upcoming showtimes
                                    with sold tickets.
                                </p>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="md"
                                    disabled={!canArchive}
                                    aria-describedby={canArchive ? undefined : 'archive-why'}
                                    onClick={() => setConfirmArchive(true)}
                                >
                                    Archive movie
                                </Button>
                            </div>
                            {!canArchive && (
                                <div className={cls.archiveNote}>
                                    <Notice tone="warning" id="archive-why">
                                        {movie.soldUpcoming} upcoming showtimes have sold tickets. Cancel them first.
                                    </Notice>
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                <div className={cls.side}>
                    <Card title="Poster" padded>
                        <Poster large tint={movie?.tint ?? ['#8B7BFF', '#17143A']} title={movie?.title ?? 'New movie'} />
                        <p className={cls.hint}>From TMDB. The site uses the poster colour for the page glow.</p>
                    </Card>
                    {movie && (
                        <Card
                            title="Showtimes"
                            actions={
                                <Link href="/admin/showtimes" className={cls.link}>
                                    Schedule
                                </Link>
                            }
                        >
                            <dl className={cls.facts}>
                                <dt>This week</dt>
                                <dd>{movie.showtimesThisWeek}</dd>
                                <dt>Upcoming with sales</dt>
                                <dd>{movie.soldUpcoming}</dd>
                            </dl>
                        </Card>
                    )}
                </div>
            </div>

            {save.error instanceof ApiError && <Notice tone="danger">{save.error.message}</Notice>}

            <div className={cls.bar}>
                <span className={cls.hint} aria-live="polite">
                    {isDirty ? 'Unsaved changes' : 'All changes saved'}
                </span>
                <Button variant="ghost" size="md" href="/admin/movies">
                    Cancel
                </Button>
                <Button type="submit" size="md" disabled={!isDirty} loading={save.isPending}>
                    {movie ? 'Save changes' : 'Add movie'}
                </Button>
            </div>

            {movie && (
                <ConfirmDialog
                    open={confirmArchive}
                    title={`Archive ${movie.title}?`}
                    consequences={['The movie disappears from the site and from search.', 'Its past orders and tickets stay in Orders.']}
                    confirmLabel="Archive movie"
                    cancelLabel="Keep it"
                    loading={archive.isPending}
                    onClose={() => setConfirmArchive(false)}
                    onConfirm={() =>
                        archive.mutate(movie.id, {
                            onSuccess: () => {
                                setConfirmArchive(false);
                                toast(`${movie.title} archived.`);
                                router.push('/admin/movies');
                            },
                        })
                    }
                />
            )}
        </form>
    );
}
