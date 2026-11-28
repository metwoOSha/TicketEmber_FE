import type { ReactNode } from 'react';
import cls from './EmptyState.module.css';

/** Nothing to show: say why and what to do next. */
export default function EmptyState({ title, text, actions }: { title: string; text?: string; actions?: ReactNode }) {
    return (
        <div className={cls.empty}>
            <h2 className={cls.title}>{title}</h2>
            {text && <p className={cls.text}>{text}</p>}
            {actions && <div className={cls.actions}>{actions}</div>}
        </div>
    );
}
