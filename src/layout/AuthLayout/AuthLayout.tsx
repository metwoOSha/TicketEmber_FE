'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Grain from '@/components/Grain/Grain';
import Logo from '@/components/Logo/Logo';
import { AUTH_EYEBROW, getAuthHero } from '@/config/auth-hero';
import { useBookingStore } from '@/store/booking.store';
import cls from './AuthLayout.module.css';

/** Split screen: floating poster columns + headline on the left, form on the right. */
export default function AuthLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const hasHold = useBookingStore((s) => !!s.selection);
    const [line1, line2] = getAuthHero(pathname, hasHold);

    return (
        <div className={cls.layout}>
            <Grain />
            <aside className={cls.poster}>
                <div className={cls.columns} aria-hidden>
                    <span className={cls.col} />
                    <span className={cls.col} />
                    <span className={cls.col} />
                    <span className={cls.col} />
                </div>
                <div className={cls.shade} />
                <div className={cls.hero}>
                    <span className={cls.eyebrow}>{AUTH_EYEBROW}</span>
                    <div className={cls.title}>
                        {line1}
                        <br />
                        {line2}
                    </div>
                </div>
            </aside>
            <div className={cls.logo}>
                <Logo />
            </div>
            <main className={cls.form}>{children}</main>
        </div>
    );
}
