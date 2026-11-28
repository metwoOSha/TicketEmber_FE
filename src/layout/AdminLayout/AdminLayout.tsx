'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { SearchField } from '@/components/admin/Field/Field';
import Toaster from '@/components/admin/Toaster/Toaster';
import Icon, { type IconName } from '@/components/Icon/Icon';
import Logo from '@/components/Logo/Logo';
import { useLogout } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/admin/useAdminData';
import { useAdminUi } from '@/store/admin-ui.store';
import { useAuthStore } from '@/store/auth.store';
import cls from './AdminLayout.module.css';

// Add a section = add a line here and a route under app/(admin)/admin.
const SECTIONS: { href: string; label: string; icon: IconName }[] = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/movies', label: 'Movies', icon: 'movies' },
    { href: '/admin/showtimes', label: 'Showtimes', icon: 'showtimes' },
    { href: '/admin/halls', label: 'Halls', icon: 'halls' },
    { href: '/admin/orders', label: 'Orders', icon: 'orders' },
    { href: '/admin/check-in', label: 'Check-in', icon: 'checkin' },
];

const isActive = (pathname: string, href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { mode, toggleMode } = useAdminUi();
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();
    const { data: dashboard } = useDashboard('today');
    const [query, setQuery] = useState('');

    // The theme lives in localStorage; read it after the first render to keep SSR and client in sync.
    useEffect(() => {
        void useAdminUi.persist.rehydrate();
    }, []);

    const search = (e: FormEvent) => {
        e.preventDefault();
        router.push(`/admin/orders?q=${encodeURIComponent(query.trim())}`);
    };

    const unpaid = dashboard?.awaitingPayment ?? 0;
    const name = user?.name ?? 'Dmytro';

    return (
        <div data-theme="admin" data-mode={mode} className={cls.layout}>
            <aside className={cls.side}>
                <div className={cls.logo}>
                    <Logo href="/admin" className={cls.logoLink} tag={<span className={cls.tag}>ADMIN</span>} />
                </div>

                <nav className={cls.nav} aria-label="Admin">
                    {SECTIONS.map((s) => {
                        const active = isActive(pathname, s.href);
                        return (
                            <Link
                                key={s.href}
                                href={s.href}
                                className={clsx(cls.link, active && cls.active)}
                                aria-current={active ? 'page' : undefined}
                            >
                                <Icon name={s.icon} />
                                <span className={cls.label}>{s.label}</span>
                                {s.href === '/admin/orders' && unpaid > 0 && (
                                    <span className={cls.count}>
                                        {unpaid}
                                        <span className="sr-only"> awaiting payment</span>
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className={cls.foot}>
                    <div className={cls.me}>
                        <span className={cls.avatar} aria-hidden>
                            {name[0]}
                        </span>
                        <span className={cls.label}>
                            <span className={cls.name}>{name}</span>
                            <span className={cls.role}>Admin</span>
                        </span>
                    </div>
                    <button
                        type="button"
                        className={cls.footItem}
                        onClick={toggleMode}
                        title={mode === 'dark' ? 'Light theme' : 'Dark theme'}
                    >
                        <Icon name="sun" size={16} />
                        <span className={cls.label}>{mode === 'dark' ? 'Light theme' : 'Dark theme'}</span>
                    </button>
                    <Link href="/" className={cls.footItem} title="Open the site">
                        <Icon name="external" size={16} />
                        <span className={cls.label}>Open the site</span>
                    </Link>
                    <button type="button" className={cls.footItem} title="Log out" onClick={() => logout.mutate()}>
                        <Icon name="logout" size={16} />
                        <span className={cls.label}>Log out</span>
                    </button>
                </div>
            </aside>

            <div className={cls.main}>
                <header className={cls.top}>
                    <form className={cls.search} onSubmit={search}>
                        <SearchField label="Search orders by code or email" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </form>
                </header>
                <main className={cls.body}>{children}</main>
            </div>
            <Toaster />
        </div>
    );
}
