import clsx from 'clsx';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import cls from './Button.module.css';

type Props = {
    variant?: 'primary' | 'ghost' | 'danger' | 'dangerSolid';
    size?: 'lg' | 'md' | 'sm';
    /** Adds the animated "→" */
    arrow?: boolean;
    /** Renders a link instead of a <button> */
    href?: string;
    loading?: boolean;
    className?: string;
    children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export default function Button({
    variant = 'primary',
    size = 'lg',
    arrow,
    href,
    loading,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
}: Props) {
    const classes = clsx(cls.btn, cls[variant], size !== 'lg' && cls[size], loading && cls.loading, className);
    const content = (
        <>
            {children}
            {arrow && <span className={cls.arrow}>→</span>}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} disabled={disabled || loading} {...rest}>
            {content}
        </button>
    );
}
