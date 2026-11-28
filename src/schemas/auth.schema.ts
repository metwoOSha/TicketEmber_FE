import { z } from 'zod';

const email = z.email('Enter a valid email');
const password = z.string().min(8, 'At least 8 characters');

export const loginSchema = z.object({ email, password });

export const registerSchema = z
    .object({
        name: z.string().trim().min(2, 'Enter your name'),
        email,
        password,
        repeatPassword: z.string(),
    })
    .refine((v) => v.password === v.repeatPassword, { path: ['repeatPassword'], message: 'Passwords do not match' });

export const forgotSchema = z.object({ email });

export const resetSchema = z
    .object({ password, repeatPassword: z.string() })
    .refine((v) => v.password === v.repeatPassword, { path: ['repeatPassword'], message: 'Passwords do not match' });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotValues = z.infer<typeof forgotSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
