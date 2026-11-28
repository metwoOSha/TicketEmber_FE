const PATHS = {
    dashboard: (
        <>
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
        </>
    ),
    movies: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
        </>
    ),
    showtimes: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4M8 14h3M8 17h6" />
        </>
    ),
    halls: <path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M4 11h16v5H4zM6 16v3M18 16v3" />,
    orders: (
        <>
            <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />
            <path d="M14 7v10" strokeDasharray="2 2" />
        </>
    ),
    checkin: <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8" />,
    external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
    logout: <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10" />,
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
    alert: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.5v.5" />
        </>
    ),
    info: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6M12 7.5v.5" />
        </>
    ),
    check: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12.5l2.5 2.5L16 9.5" />
        </>
    ),
    refresh: <path d="M20 11a8 8 0 0 0-14.5-4.5M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5M20 20v-4h-4" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    sun: (
        <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
        </>
    ),
    arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
} as const;

export type IconName = keyof typeof PATHS;

/** Stroke icon, inherits the text color. Decorative unless `label` is given. */
export default function Icon({ name, size = 18, label }: { name: IconName; size?: number; label?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={label ? undefined : true}
            role={label ? 'img' : undefined}
            aria-label={label}
        >
            {PATHS[name]}
        </svg>
    );
}
