import type { ReactNode } from 'react';
import cls from './SectionTitle.module.css';

/** Small caps section label, optional action on the right. */
export default function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
    return (
        <div className={cls.row}>
            <h2 className={cls.title}>{children}</h2>
            {action}
        </div>
    );
}
