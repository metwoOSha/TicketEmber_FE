import clsx from 'clsx';
import cls from './Segmented.module.css';

export type SegmentOption<T extends string> = { value: T; label: string; count?: number | string };

type Props<T extends string> = { label: string; options: SegmentOption<T>[]; value: T; onChange: (value: T) => void; className?: string };

/** Pill switch for filters and periods. Wraps to new lines on narrow screens. */
export default function Segmented<T extends string>({ label, options, value, onChange, className }: Props<T>) {
    return (
        <fieldset className={clsx(cls.seg, className)}>
            <legend className="sr-only">{label}</legend>
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    className={clsx(cls.option, o.value === value && cls.on)}
                    aria-pressed={o.value === value}
                    onClick={() => onChange(o.value)}
                >
                    {o.label}
                    {o.count !== undefined && <span className={cls.count}>{o.count}</span>}
                </button>
            ))}
        </fieldset>
    );
}
