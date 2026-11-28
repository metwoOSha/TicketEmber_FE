import clsx from 'clsx';
import cls from './PasswordStrength.module.css';

const LABELS = ['Weak', 'Okay', 'Good'] as const;

/** 0..3 from length and character variety. */
export function getPasswordStrength(password: string) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    return Math.max(score, 1);
}

export default function PasswordStrength({ password }: { password: string }) {
    const strength = getPasswordStrength(password);

    return (
        <div className={cls.meter} aria-live="polite">
            {LABELS.map((label, i) => (
                <span key={label} className={clsx(cls.bar, i < strength && cls.on)} />
            ))}
            <span className={cls.text}>{strength ? LABELS[strength - 1] : ''}</span>
        </div>
    );
}
