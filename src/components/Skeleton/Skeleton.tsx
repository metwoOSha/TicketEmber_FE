import clsx from 'clsx';
import type { CSSProperties } from 'react';
import cls from './Skeleton.module.css';

/** Shimmering placeholder block. Size it with width/height props or className. */
export default function Skeleton({
    width,
    height,
    radius,
    className,
}: {
    width?: number | string;
    height?: number | string;
    radius?: number | string;
    className?: string;
}) {
    const style: CSSProperties = { width, height, borderRadius: radius };
    return <span className={clsx(cls.sk, className)} style={style} aria-hidden />;
}
