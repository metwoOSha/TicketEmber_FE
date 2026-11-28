'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import Badge from '@/components/admin/Badge/Badge';
import Card from '@/components/admin/Card/Card';
import EmptyState from '@/components/admin/EmptyState/EmptyState';
import { SearchField } from '@/components/admin/Field/Field';
import PageHeader from '@/components/admin/PageHeader/PageHeader';
import Poster from '@/components/admin/Poster/Poster';
import Segmented from '@/components/admin/Segmented/Segmented';
import Table, { tableCls } from '@/components/admin/Table/Table';
import Button from '@/components/Button/Button';
import Chip from '@/components/Chip/Chip';
import Icon from '@/components/Icon/Icon';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAdminMovies } from '@/hooks/admin/useAdminData';
import type { AdminMovie, MovieStatus, Tone } from '@/types/admin.types';
import { formatDuration } from '@/utils/format';
import TmdbImportDialog from './TmdbImportDialog';
import cls from './Movies.module.css';

export const MOVIE_STATUS: Record<MovieStatus, { label: string; tone: Tone }> = {
    now: { label: 'Now showing', tone: 'ok' },
    soon: { label: 'Coming soon', tone: 'info' },
    archived: { label: 'Archived', tone: 'mute' },
};

const TABS: { value: MovieStatus; label: string }[] = [
    { value: 'now', label: 'Now showing' },
    { value: 'soon', label: 'Coming soon' },
    { value: 'archived', label: 'Archived' },
];

/** "21 this week", "Opens 4 Dec", "Not scheduled" */
function schedule(m: AdminMovie) {
    if (m.status === 'soon') return m.opensAt ? `Opens ${dayjs(m.opensAt).format('D MMM')}` : 'Not scheduled';
    if (m.status === 'archived') return '—';
    return `${m.showtimesThisWeek} this week`;
}

export default function Movies() {
    const { data: movies, isPending } = useAdminMovies();
    const [tab, setTab] = useState<MovieStatus>('now');
    const [query, setQuery] = useState('');
    const [importOpen, setImportOpen] = useState(false);

    const q = query.trim().toLowerCase();
    const rows = (movies ?? []).filter((m) => m.status === tab && (!q || m.title.toLowerCase().includes(q)));

    return (
        <>
            <PageHeader
                title="Movies"
                sub="Details come from TMDB. You set the status and the age rating."
                actions={
                    <>
                        <Button variant="ghost" size="md" href="/admin/movies/new">
                            Add manually
                        </Button>
                        <Button size="md" onClick={() => setImportOpen(true)}>
                            <Icon name="plus" size={16} />
                            Import from TMDB
                        </Button>
                    </>
                }
            />

            <div className={cls.filters}>
                <Segmented
                    label="Status"
                    options={TABS.map((t) => ({ ...t, count: movies?.filter((m) => m.status === t.value).length }))}
                    value={tab}
                    onChange={setTab}
                />
                <SearchField label="Search by title" className={cls.search} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <Card aria-label="Movies">
                {isPending ? (
                    <div className={cls.loading}>
                        <Skeleton height={240} />
                    </div>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Movie</th>
                                <th>Genres</th>
                                <th>Length</th>
                                <th>Age</th>
                                <th>TMDB rating</th>
                                <th>Showtimes</th>
                                <th>Status</th>
                                <th>
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((m) => (
                                <tr key={m.id}>
                                    <td>
                                        <span className={cls.movie}>
                                            <Poster tint={m.tint} />
                                            <span>
                                                <b className={cls.title}>{m.title}</b>
                                                <span className={cls.muted}>{m.year}</span>
                                            </span>
                                        </span>
                                    </td>
                                    <td className={cls.muted}>{m.genres.join(', ')}</td>
                                    <td className={`${tableCls.nowrap} ${tableCls.num}`}>{formatDuration(m.durationMin)}</td>
                                    <td>
                                        <Chip>{m.ageRating}</Chip>
                                    </td>
                                    <td className={tableCls.num}>{m.tmdbRating ?? '—'}</td>
                                    <td className={tableCls.nowrap}>{schedule(m)}</td>
                                    <td>
                                        <Badge tone={MOVIE_STATUS[m.status].tone}>{MOVIE_STATUS[m.status].label}</Badge>
                                    </td>
                                    <td className={tableCls.right}>
                                        <Button variant="ghost" size="sm" href={`/admin/movies/${m.id}`}>
                                            Edit<span className="sr-only"> {m.title}</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {movies && rows.length === 0 && (
                    <EmptyState
                        title={q ? 'No movies match the search' : `No movies in ${MOVIE_STATUS[tab].label}`}
                        text="Import one from TMDB or change the filter."
                        actions={
                            <Button size="md" onClick={() => setImportOpen(true)}>
                                Import from TMDB
                            </Button>
                        }
                    />
                )}
            </Card>

            <TmdbImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
        </>
    );
}
