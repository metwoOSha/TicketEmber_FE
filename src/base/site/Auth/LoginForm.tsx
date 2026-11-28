'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import NavLink from '@/components/NavLink/NavLink';
import { useLogin } from '@/hooks/useAuth';
import { type LoginValues, loginSchema } from '@/schemas/auth.schema';
import { useBookingStore } from '@/store/booking.store';
import cls from './Auth.module.css';
import AuthTabs from './AuthTabs';
import HoldNotice from './HoldNotice';

export default function LoginForm() {
    const hasHold = useBookingStore((s) => !!s.selection);
    const { mutate, isPending, error } = useLogin();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

    return (
        <form className={cls.form} onSubmit={handleSubmit((values) => mutate(values))} noValidate>
            <HoldNotice />
            <AuthTabs active="/login" />
            <div className={cls.fields}>
                <Input label="EMAIL" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                <Input
                    label="PASSWORD"
                    type="password"
                    placeholder="At least 8 characters"
                    error={errors.password?.message}
                    {...register('password')}
                />
            </div>
            {error && <p className={cls.error}>{error.message}</p>}
            <div className={cls.actions}>
                <Button type="submit" arrow loading={isPending}>
                    {hasHold ? 'Log in and continue' : 'Log in'}
                </Button>
                <NavLink href="/forgot" className={cls.small}>
                    Forgot password?
                </NavLink>
            </div>
            <p className={cls.note}>
                {hasHold
                    ? 'After logging in you go straight to checkout and the 15-minute hold starts.'
                    : 'Demo project. Use any email, payments are fake.'}
            </p>
        </form>
    );
}
