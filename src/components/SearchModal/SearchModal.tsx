'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Highlight from '@/components/Highlight/Highlight';
import NavLink from '@/components/NavLink/NavLink';
import { useSearch } from '@/hooks/useSearch';
import type { SearchHit } from '@/types/movie.types';
import { tmdbImage } from '@/utils/tmdb';
import cls from './SearchModal.module.css';

type Props = { initialQuery?: string; onClose: () => void };

export default function SearchModal({ initialQuery = '', onClose }: Props) {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);
    const [active, setActive] = useState(0);
    const { data } = useSearch(query);

    const hits = useMemo(() => [...(data?.nowShowing ?? []), ...(data?.comingSoon ?? [])], [data]);
    const hasQuery = query.trim().length > 0;
    const nowCount = data?.nowShowing.length ?? 0;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    const open = (hit: SearchHit, comingSoon: boolean) => {
        router.push(comingSoon ? '/coming-soon' : `/movies/${hit.id}`);
        onClose();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, hits.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && hits[active]) {
            open(hits[active], active >= nowCount);
        }
    };

    const renderGroup = (title: string, items: SearchHit[], offset: number, comingSoon: boolean) =>
        items.length > 0 && (
            <>
                <div className={cls.group}>{title}</div>
                {items.map((hit, i) => {
                    const poster = tmdbImage(hit.posterPath, 'w185');
                    return (
                        <button
                            key={hit.id}
                            type="button"
                            className={clsx(cls.hit, offset + i === active && cls.active)}
                            onMouseEnter={() => setActive(offset + i)}
                            onClick={() => open(hit, comingSoon)}
                        >
                            <span className={cls.thumb} style={{ background: `linear-gradient(170deg, ${hit.tint[0]}, #050507)` }}>
                                {poster && <img src={poster} alt="" />}
                            </span>
                            <span className={cls.text}>
                                <span className={cls.title}>
                                    <Highlight text={hit.title} query={query} />
                                </span>
                                <span className={cls.meta}>{hit.meta}</span>
                            </span>
                            <span className={cls.note}>{hit.note}</span>
                        </button>
                    );
                })}
            </>
        );

    return (
        <div className={cls.overlay}>
            <button type="button" className={cls.backdrop} aria-label="Close search" tabIndex={-1} onClick={onClose} />
            <dialog open className={cls.panel} aria-label="Search films" onKeyDown={onKeyDown}>
                <div className={cls.field}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-4-4" />
                    </svg>
                    <input
                        className={cls.input}
                        // oxlint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        placeholder="Search films"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setActive(0);
                        }}
                    />
                    <span className={cls.esc}>ESC</span>
                </div>
                {renderGroup('NOW SHOWING', data?.nowShowing ?? [], 0, false)}
                {renderGroup('COMING SOON', data?.comingSoon ?? [], nowCount, true)}
                {hasQuery && data && hits.length === 0 && (
                    <div className={cls.empty}>
                        <div className={cls.emptyTitle}>No films match &quot;{query}&quot;</div>
                        <p>Check the spelling or try a shorter title. You can also browse everything we have:</p>
                        <div className={cls.browse}>
                            <NavLink href="/" onClick={onClose}>
                                Now showing →
                            </NavLink>
                            <NavLink href="/coming-soon" onClick={onClose}>
                                Coming soon →
                            </NavLink>
                        </div>
                    </div>
                )}
                <div className={cls.footer}>
                    {hits.length > 0 && (
                        <>
                            <span>↑↓ navigate</span>
                            <span>Enter open</span>
                        </>
                    )}
                    <span>Esc close</span>
                    <span className={cls.count}>
                        {hits.length} result{hits.length === 1 ? '' : 's'}
                    </span>
                </div>
            </dialog>
        </div>
    );
}
