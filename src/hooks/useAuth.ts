'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { forgotPassword, login, logout, register, resetPassword } from '@/api/Auth.api';
import { useAuthStore } from '@/store/auth.store';

/** Only allow same-site relative redirects. */
function safeNext(next: string | null) {
    return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

export function useLogin() {
    const router = useRouter();
    const next = safeNext(useSearchParams().get('next'));
    const setUser = useAuthStore((s) => s.setUser);
    return useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            setUser(user);
            router.push(next);
        },
    });
}

export function useRegister() {
    const router = useRouter();
    const next = safeNext(useSearchParams().get('next'));
    const setUser = useAuthStore((s) => s.setUser);
    return useMutation({
        mutationFn: register,
        onSuccess: (user) => {
            setUser(user);
            router.push(next);
        },
    });
}

export function useForgotPassword() {
    const router = useRouter();
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (_res, { email }) => router.push(`/forgot/sent?email=${encodeURIComponent(email)}`),
    });
}

export function useResetPassword() {
    const router = useRouter();
    return useMutation({ mutationFn: resetPassword, onSuccess: () => router.push('/') });
}

export function useLogout() {
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            setUser(null);
            router.push('/');
        },
    });
}
