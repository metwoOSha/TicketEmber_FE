import clsx from 'clsx';
import cls from './Bar.module.css';

/** Thin fill bar. Turns yellow from 90% and red at 100%. Always paired with the numbers in text. */
export default function Bar({ value, max, className }: { value: number; max: number; className?: string }) {
    const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return (
        <span className={clsx(cls.bar, className)} aria-hidden>
            <i className={clsx(cls.fill, pct === 100 && cls.full, pct >= 90 && pct < 100 && cls.hot)} style={{ width: `${pct}%` }} />
        </span>
    );
}
