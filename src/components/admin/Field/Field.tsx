import clsx from 'clsx';
import { type InputHTMLAttributes, type ReactNode, type Ref, type SelectHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react';
import cls from './Field.module.css';

type Common = {
    label: ReactNode;
    hint?: ReactNode;
    error?: string;
    /** Extra element ids that describe the field, e.g. a notice below the form */
    describedBy?: string;
    className?: string;
};

/** Label, control, hint and error wired together with ids. */
function FieldShell({ label, hint, error, className, id, children }: Common & { id: string; children: ReactNode }) {
    return (
        <div className={clsx(cls.field, className)}>
            <label htmlFor={id} className={cls.label}>
                {label}
            </label>
            {children}
            {hint && !error && (
                <span id={`${id}-hint`} className={cls.hint}>
                    {hint}
                </span>
            )}
            {error && (
                <span id={`${id}-error`} className={cls.error}>
                    {error}
                </span>
            )}
        </div>
    );
}

function aria(id: string, { hint, error, describedBy }: Common) {
    const ids = [hint && !error && `${id}-hint`, error && `${id}-error`, describedBy].filter(Boolean).join(' ');
    return { 'aria-invalid': !!error || undefined, 'aria-describedby': ids || undefined };
}

type InputProps = Common & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { ref?: Ref<HTMLInputElement> };

export function TextField({ label, hint, error, describedBy, className, ref, ...input }: InputProps) {
    const id = useId();
    return (
        <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
            <input
                id={id}
                ref={ref}
                className={clsx(cls.control, error && cls.invalid)}
                {...aria(id, { label, hint, error, describedBy })}
                {...input}
            />
        </FieldShell>
    );
}

type SelectProps = Common & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & { ref?: Ref<HTMLSelectElement> };

export function SelectField({ label, hint, error, describedBy, className, ref, children, ...select }: SelectProps) {
    const id = useId();
    return (
        <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
            <select
                id={id}
                ref={ref}
                className={clsx(cls.control, error && cls.invalid)}
                {...aria(id, { label, hint, error, describedBy })}
                {...select}
            >
                {children}
            </select>
        </FieldShell>
    );
}

type TextAreaProps = Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & { ref?: Ref<HTMLTextAreaElement> };

export function TextAreaField({ label, hint, error, describedBy, className, ref, ...area }: TextAreaProps) {
    const id = useId();
    return (
        <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
            <textarea
                id={id}
                ref={ref}
                className={clsx(cls.control, cls.area, error && cls.invalid)}
                {...aria(id, { label, hint, error, describedBy })}
                {...area}
            />
        </FieldShell>
    );
}

/** Search box with an icon, for filters above tables. */
export function SearchField({
    label,
    className,
    ref,
    ...input
}: { label: string; className?: string; ref?: Ref<HTMLInputElement> } & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>) {
    return (
        <label className={clsx(cls.search, className)}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden
            >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
            </svg>
            <input ref={ref} type="search" aria-label={label} placeholder={label} {...input} />
        </label>
    );
}
