import clsx from 'clsx';
import type { InputHTMLAttributes, Ref } from 'react';
import cls from './Input.module.css';

type Props = {
    label: string;
    error?: string;
    ref?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

/** Underlined field with a caps label. Works with react-hook-form's `register`. */
export default function Input({ label, error, className, ref, ...rest }: Props) {
    return (
        <label className={clsx(cls.field, className)}>
            <span className={cls.label}>{label}</span>
            <input ref={ref} className={clsx(cls.input, error && cls.invalid)} aria-invalid={!!error} {...rest} />
            {error && <span className={cls.error}>{error}</span>}
        </label>
    );
}
