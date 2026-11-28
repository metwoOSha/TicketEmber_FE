import clsx from 'clsx';
import Link from 'next/link';
import cls from './AuthTabs.module.css';

const TABS = [
    { href: '/login', label: 'Log in' },
    { href: '/register', label: 'Create account' },
];

/** Log in / Create account switch; each is its own route. */
export default function AuthTabs({ active }: { active: '/login' | '/register' }) {
    return (
        <div className={cls.tabs}>
            {TABS.map((tab) => (
                <Link key={tab.href} href={tab.href} className={clsx(cls.tab, tab.href === active && cls.active)}>
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}
