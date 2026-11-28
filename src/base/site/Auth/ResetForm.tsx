'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import PasswordStrength from '@/components/PasswordStrength/PasswordStrength';
import { useResetPassword } from '@/hooks/useAuth';
import { type ResetValues, resetSchema } from '@/schemas/auth.schema';
import cls from './Auth.module.css';
import AuthHeading from './AuthHeading';

export default function ResetForm({ token }: { token: string }) {
    const { mutate, isPending, error } = useResetPassword();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });
    const password = useWatch({ control, name: 'password' }) ?? '';

    return (
        <form className={cls.form} onSubmit={handleSubmit((values) => mutate({ ...values, token }))} noValidate>
            <AuthHeading title="Set a new password" lead="At least 8 characters. You will be logged in after saving." />
            <Input
                label="NEW PASSWORD"
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
            <PasswordStrength password={password} />
            {error && <p className={cls.error}>{error.message}</p>}
            <div className={cls.actions}>
                <Button type="submit" arrow loading={isPending}>
                    Save password
                </Button>
            </div>
        </form>
    );
}
