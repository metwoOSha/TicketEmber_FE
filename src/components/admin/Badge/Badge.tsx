import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { Tone } from '@/types/admin.types';
import cls from './Badge.module.css';

/** Status pill: a dot and the status text. Colour is never the only cue. */
export default function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
    return <span className={clsx(cls.badge, cls[tone])}>{children}</span>;
}
