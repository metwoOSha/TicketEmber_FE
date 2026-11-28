import Logo from '@/components/Logo/Logo';
import NavLink from '@/components/NavLink/NavLink';
import SearchBox from '@/components/SearchBox/SearchBox';
import HeaderAccount from './HeaderAccount';
import cls from './Header.module.css';

const NAV = [
    { href: '/', label: 'Now showing' },
    { href: '/coming-soon', label: 'Coming soon' },
    { href: '/my-tickets', label: 'My tickets' },
];

export default function Header() {
    return (
        <header className={cls.header}>
            <div className={cls.logo}>
                <Logo />
            </div>
            <div className={cls.center}>
                <SearchBox />
                <nav className={cls.nav}>
                    {NAV.map((item) => (
                        <NavLink key={item.href} href={item.href}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className={cls.account}>
                <HeaderAccount />
            </div>
        </header>
    );
}
