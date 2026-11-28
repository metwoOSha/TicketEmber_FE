import Link from 'next/link';
import type { ReactNode } from 'react';
import cls from './TicketStub.module.css';

type Props = { href: string; label: ReactNode; extra: ReactNode; ariaLabel: string; title?: string };

/** Ticket-shaped link with a perforation: "LOG IN | →", "DIMA | 02". */
export default function TicketStub({ href, label, extra, ariaLabel, title }: Props) {
    return (
        <Link href={href} className={cls.stub} aria-label={ariaLabel} title={title}>
            <span className={cls.a}>{label}</span>
            <span className={cls.perf} />
            <span className={cls.b}>{extra}</span>
        </Link>
    );
}
