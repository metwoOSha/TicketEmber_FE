'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import cls from './NavLink.module.css';

/** Link with the animated underline; stays underlined when its route is active. */
export default function NavLink({ href, className, ...rest }: ComponentProps<typeof Link>) {
    const pathname = usePathname();
    const active = typeof href === 'string' && (href === '/' ? pathname === '/' : pathname.startsWith(href));

    return <Link href={href} className={clsx(cls.link, active && cls.active, className)} {...rest} />;
}
