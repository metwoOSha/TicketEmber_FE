import clsx from 'clsx';
import type { ReactNode } from 'react';
import cls from './Card.module.css';

type Props = {
    title?: ReactNode;
    /** Right side of the header: a link or buttons */
    actions?: ReactNode;
    /** Adds inner padding to the body */
    padded?: boolean;
    className?: string;
    children: ReactNode;
    as?: 'section' | 'aside' | 'div';
    'aria-label'?: string;
};

/** Raised panel. Tables and lists sit on it so text never floats on the page glow. */
export default function Card({ title, actions, padded, className, children, as: Tag = 'section', ...rest }: Props) {
    return (
        <Tag className={clsx(cls.card, className)} {...rest}>
            {(title || actions) && (
                <div className={cls.head}>
                    {title && <h2 className={cls.title}>{title}</h2>}
                    {actions}
                </div>
            )}
            <div className={clsx(padded && cls.pad)}>{children}</div>
        </Tag>
    );
}
