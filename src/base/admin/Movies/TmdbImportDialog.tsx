'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Badge from '@/components/admin/Badge/Badge';
import Dialog from '@/components/admin/Dialog/Dialog';
import { TextField } from '@/components/admin/Field/Field';
import Poster from '@/components/admin/Poster/Poster';
import Button from '@/components/Button/Button';
import { useImportMovie, useTmdbSearch } from '@/hooks/admin/useAdminData';
import { useDebounced } from '@/hooks/useDebounced';
import { useAdminUi } from '@/store/admin-ui.store';
import cls from './Movies.module.css';

export default function TmdbImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <Dialog open={open} title="Import from TMDB" onClose={onClose} width={620}>
            {/* Mounted only while open, so the search starts empty every time */}
            <ImportBody onClose={onClose} />
        </Dialog>
    );
}

function ImportBody({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const toast = useAdminUi((s) => s.toast);
    const [query, setQuery] = useState('');
    const debounced = useDebounced(query, 300);
    const { data: results, isFetching } = useTmdbSearch(debounced);
    const importMovie = useImportMovie();

    const onImport = (tmdbId: number) =>
        importMovie.mutate(tmdbId, {
            onSuccess: (movie) => {
                toast(`${movie.title} imported as Coming soon.`);
                onClose();
                router.push(`/admin/movies/${movie.id}`);
            },
        });

    return (
        <>
            <TextField
                label="Title or TMDB ID"
                value={query}
                data-autofocus
                onChange={(e) => setQuery(e.target.value)}
                hint={isFetching ? 'Searching…' : undefined}
            />
            {results && results.length > 0 && (
                <ul className={cls.results}>
                    {results.map((r) => (
                        <li key={r.tmdbId} className={cls.result}>
                            <span className={cls.movie}>
                                <Poster tint={r.tint} />
                                <span>
                                    <b className={cls.title}>{r.title}</b>
                                    <span className={cls.muted}>
                                        {r.year}, {r.director}, TMDB {r.tmdbId}
                                    </span>
                                </span>
                            </span>
                            {r.added ? (
                                <Badge tone="mute">Already added</Badge>
                            ) : (
                                <Button
                                    size="sm"
                                    loading={importMovie.isPending && importMovie.variables === r.tmdbId}
                                    onClick={() => onImport(r.tmdbId)}
                                >
                                    Import
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {results && results.length === 0 && <p className={cls.muted}>Nothing found on TMDB for “{debounced}”.</p>}
            <p className={cls.muted}>
                Import copies title, length, genres, cast, poster and trailer. The movie is saved with the status Coming soon.
            </p>
        </>
    );
}
