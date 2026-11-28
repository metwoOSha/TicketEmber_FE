import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import cls from './Footer.module.css';

const COLUMNS = [
    {
        title: 'CINEMA',
        links: [
            { href: '/', label: 'Now showing' },
            { href: '/coming-soon', label: 'Coming soon' },
        ],
    },
    {
        title: 'ACCOUNT',
        links: [
            { href: '/my-tickets', label: 'My tickets' },
            { href: '/settings', label: 'Settings' },
            { href: '/login', label: 'Log in' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className={cls.footer}>
            <div className={cls.grid}>
                <div className={cls.about}>
                    <Logo />
                    <span className={cls.text}>Book cinema seats in a couple of clicks. Demo project: payments are fake.</span>
                </div>
                {COLUMNS.map((col) => (
                    <div key={col.title} className={cls.col}>
                        <span className={cls.heading}>{col.title}</span>
                        {col.links.map((link) => (
                            <Link key={link.href} href={link.href} className={cls.link}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            <div className={cls.bottom}>
                <span>© 2026 Ticketember</span>
                {/* TMDB attribution is required */}
                <span>Posters and photos: TMDB</span>
            </div>
        </footer>
    );
}
