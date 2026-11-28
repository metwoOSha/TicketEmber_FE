import clsx from 'clsx';
import type { ReactNode } from 'react';
import Icon from '@/components/Icon/Icon';
import cls from './Notice.module.css';

type Props = {
    tone: 'danger' | 'warning' | 'success';
    children: ReactNode;
    /** For aria-describedby on the field this message explains */
    id?: string;
    /** A button on the right, e.g. "Use 20:30" */
    action?: ReactNode;
    className?: string;
};

const ICON = { danger: 'alert', warning: 'info', success: 'check' } as const;

/** Inline message with an icon: red for errors, yellow for heads-ups, green for all clear. */
export default function Notice({ tone, children, id, action, className }: Props) {
    return (
        <div id={id} role={tone === 'danger' ? 'alert' : 'status'} className={clsx(cls.notice, cls[tone], className)}>
            <Icon name={ICON[tone]} />
            <span className={cls.text}>{children}</span>
            {action}
        </div>
    );
}
