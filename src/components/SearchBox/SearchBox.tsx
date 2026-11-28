'use client';

import { useState } from 'react';
import SearchModal from '@/components/SearchModal/SearchModal';
import cls from './SearchBox.module.css';

/** Icon that expands into an input on hover; typing or clicking opens the search modal. */
export default function SearchBox() {
    const [query, setQuery] = useState<string | null>(null);

    return (
        <>
            <label className={cls.search} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" />
                </svg>
                <input
                    className={cls.input}
                    placeholder="Search films"
                    value=""
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setQuery('')}
                />
            </label>
            {query !== null && <SearchModal initialQuery={query} onClose={() => setQuery(null)} />}
        </>
    );
}
