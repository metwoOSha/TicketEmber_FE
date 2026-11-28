import { create } from 'zustand';
import type { User } from '@/types/user.types';

type AuthState = {
    user: User | null;
    setUser: (user: User | null) => void;
};

// TODO: replace with a real /auth/me query once the backend is connected (the cookie is httpOnly).
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
