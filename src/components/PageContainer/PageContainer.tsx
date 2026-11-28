import type { ReactNode } from 'react';
import cls from './PageContainer.module.css';

/** Standard page body: leaves room for the floating header and keeps side padding. */
export default function PageContainer({ children }: { children: ReactNode }) {
    return <div className={cls.container}>{children}</div>;
}
