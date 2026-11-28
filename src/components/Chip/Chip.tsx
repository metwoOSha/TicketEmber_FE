import clsx from 'clsx';
import type { ReactNode } from 'react';
import cls from './Chip.module.css';

/** Small outlined tag: "2D", "IMAX", "16+". */
export default function Chip({ children, className }: { children: ReactNode; className?: string }) {
    return <span className={clsx(cls.chip, className)}>{children}</span>;
}
