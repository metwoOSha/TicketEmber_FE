'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { useRegister } from '@/hooks/useAuth';
import { type RegisterValues, registerSchema } from '@/schemas/auth.schema';
import cls from './Auth.module.css';
import AuthTabs from './AuthTabs';

export default function RegisterForm() {
    const { mutate, isPending, error } = useRegister();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

    return (
        <form className={cls.form} onSubmit={handleSubmit((values) => mutate(values))} noValidate>
            <AuthTabs active="/register" />
            <div className={cls.fields}>
                <Input label="NAME" placeholder="Your name" error={errors.name?.message} {...register('name')} />
                <Input label="EMAIL" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                <Input
                    label="PASSWORD"
                    type="password"
                    placeholder="At least 8 characters"
                    error={errors.password?.message}
                    {...register('password')}
                />
                <Input
                    label="REPEAT PASSWORD"
                    type="password"
                    placeholder="Repeat password"
                    error={errors.repeatPassword?.message}
                    {...register('repeatPassword')}
                />
            </div>
            {error && <p className={cls.error}>{error.message}</p>}
            <div className={cls.actions}>
                <Button type="submit" arrow loading={isPending}>
                    Create account
                </Button>
            </div>
            <p className={cls.note}>Demo project. Use any email, payments are fake.</p>
        </form>
    );
}
