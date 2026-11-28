import clsx from 'clsx';
import type { ReactNode } from 'react';
import Button from '@/components/Button/Button';
import cls from './StatusTicket.module.css';

type Props = {
    code: string;
    title: string;
    text: string;
    /** Small line at the bottom of the ticket: "ROW ? · SEAT ?" */
    footer: string;
    danger?: boolean;
    /** Primary action: a link or a button */
    action: { label: string; href?: string; onClick?: () => void };
    secondary?: ReactNode;
};

/** "ADMIT NONE" ticket used by 404 and 500. */
export default function StatusTicket({ code, title, text, footer, danger, action, secondary }: Props) {
    return (
        <div className={cls.wrap}>
            <div className={cls.shadow}>
                <div className={cls.ticket}>
                    <span className={clsx(cls.admit, danger && cls.danger)}>ADMIT NONE</span>
                    <span className={cls.code}>{code}</span>
                    <div className={cls.perf} />
                    <span className={cls.footer}>{footer}</span>
                </div>
            </div>
            <h1 className={cls.title}>{title}</h1>
            <p className={cls.text}>{text}</p>
            <div className={cls.actions}>
                <Button arrow href={action.href} onClick={action.onClick}>
                    {action.label}
                </Button>
                {secondary}
            </div>
        </div>
    );
}
