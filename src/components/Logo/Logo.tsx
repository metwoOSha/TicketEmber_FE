import clsx from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';
import PulseDot from '@/components/PulseDot/PulseDot';
import cls from './Logo.module.css';

/** Wordmark. The admin passes its own home link and an "ADMIN" tag. */
export default function Logo({ href = '/', tag, className }: { href?: string; tag?: ReactNode; className?: string }) {
    return (
        <Link href={href} className={clsx(cls.logo, className)}>
            <PulseDot />
            TICKETEMBER
            {tag}
        </Link>
    );
}
