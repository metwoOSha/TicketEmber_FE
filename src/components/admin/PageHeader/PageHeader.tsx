import Link from 'next/link';
import type { ReactNode } from 'react';
import cls from './PageHeader.module.css';

type Props = {
    title: ReactNode;
    sub?: ReactNode;
    /** Parent page link above the title: "Movies" */
    back?: { href: string; label: string };
    /** Next to the title: a status badge */
    badge?: ReactNode;
    actions?: ReactNode;
};

export default function PageHeader({ title, sub, back, badge, actions }: Props) {
    return (
        <header className={cls.head}>
            <div className={cls.text}>
                {back && (
                    <Link href={back.href} className={cls.back}>
                        ← {back.label}
                    </Link>
                )}
                <div className={cls.titleRow}>
                    <h1 className={cls.title}>{title}</h1>
                    {badge}
                </div>
                {sub && <p className={cls.sub}>{sub}</p>}
            </div>
            {actions && <div className={cls.actions}>{actions}</div>}
        </header>
    );
}
