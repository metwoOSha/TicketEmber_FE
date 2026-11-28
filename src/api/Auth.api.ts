import type { ForgotValues, LoginValues, RegisterValues, ResetValues } from '@/schemas/auth.schema';
import type { User } from '@/types/user.types';
import { mockDelay } from '@/api/mock-delay';

// TODO: backend is not connected yet. Replace each body with the matching call, e.g.
// post<User>('/auth/login', values). The Next route handlers in app/api/auth/* set the cookies.

const MOCK_USER: User = { id: 'u1', name: 'Dmytro', email: 'dmytro@example.com' };

export async function login(values: LoginValues): Promise<User> {
    await mockDelay();
    return { ...MOCK_USER, email: values.email };
}

export async function register(values: RegisterValues): Promise<User> {
    await mockDelay();
    return { ...MOCK_USER, name: values.name, email: values.email };
}

export async function forgotPassword(_values: ForgotValues): Promise<void> {
    await mockDelay();
}

export async function resetPassword(_values: ResetValues & { token: string }): Promise<void> {
    await mockDelay();
}

export async function logout(): Promise<void> {
    await mockDelay(200);
}
