import type { ReactNode } from 'react';
import Grain from '@/components/Grain/Grain';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import cls from './SiteLayout.module.css';

/** Public pages: floating header over the content, ambient glow + grain behind. */
export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className={cls.layout}>
            <Grain />
            <Header />
            <main className={cls.main}>{children}</main>
            <Footer />
        </div>
    );
}
