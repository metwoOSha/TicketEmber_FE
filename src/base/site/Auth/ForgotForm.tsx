'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import NavLink from '@/components/NavLink/NavLink';
import { useForgotPassword } from '@/hooks/useAuth';
import { type ForgotValues, forgotSchema } from '@/schemas/auth.schema';
import cls from './Auth.module.css';
import AuthHeading from './AuthHeading';

export default function ForgotForm() {
    const { mutate, isPending, error } = useForgotPassword();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

    return (
        <form className={cls.form} onSubmit={handleSubmit((values) => mutate(values))} noValidate>
            <AuthHeading title="Forgot password?" lead="Enter your email and we will send a link to set a new password." />
            <Input label="EMAIL" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            {error && <p className={cls.error}>{error.message}</p>}
            <div className={cls.actions}>
                <Button type="submit" arrow loading={isPending}>
                    Send link
                </Button>
                <NavLink href="/login" className={cls.small}>
                    ← Back to log in
                </NavLink>
            </div>
        </form>
    );
}
