import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/base/site/Auth/LoginForm';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
    // useSearchParams inside the form needs a Suspense boundary
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
