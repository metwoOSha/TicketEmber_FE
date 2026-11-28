import type { ReactNode } from 'react';
import cls from './Auth.module.css';

export default function AuthHeading({ title, lead }: { title: string; lead?: ReactNode }) {
    return (
        <>
            <h1 className={cls.title}>{title}</h1>
            {lead && <p className={cls.lead}>{lead}</p>}
        </>
    );
}
