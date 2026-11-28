import type { Metadata } from 'next';
import ForgotForm from '@/base/site/Auth/ForgotForm';

export const metadata: Metadata = { title: 'Forgot password' };

export default function ForgotPage() {
    return <ForgotForm />;
}
