'use client';

import NavLink from '@/components/NavLink/NavLink';
import { useForgotPassword } from '@/hooks/useAuth';
import cls from './Auth.module.css';
import AuthHeading from './AuthHeading';

export default function ForgotSent({ email }: { email: string }) {
    // Resend goes through the same mutation and lands on this page again.
    const { mutate, isPending } = useForgotPassword();

    return (
        <div className={cls.form}>
            <svg
                className={cls.icon}
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
            </svg>
            <AuthHeading
                title="Check your inbox"
                lead={
                    <>
                        We sent a link to <strong>{email}</strong>. It works for 30 minutes.
                    </>
                }
            />
            <div className={cls.links}>
                <span>
                    Nothing in a few minutes? Check spam, or{' '}
                    <button type="button" className={cls.inlineLink} disabled={isPending} onClick={() => mutate({ email })}>
                        send again
                    </button>
                    .
                </span>
                {/* Demo only: a real link arrives by email */}
                <NavLink href="/reset?token=demo" className={cls.small}>
                    Open the link from the email →
                </NavLink>
            </div>
            <NavLink href="/login" className={cls.small}>
                ← Back to log in
            </NavLink>
        </div>
    );
}
