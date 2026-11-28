import type { ReactNode } from 'react';
import Grain from '@/components/Grain/Grain';
import Logo from '@/components/Logo/Logo';
import cls from './StatusLayout.module.css';

/** Centered single message: 404, error, coming soon. */
export default function StatusLayout({ children }: { children: ReactNode }) {
    return (
        <div className={cls.layout}>
            <Grain />
            <div className={cls.logo}>
                <Logo />
            </div>
            <main className={cls.main}>{children}</main>
        </div>
    );
}
