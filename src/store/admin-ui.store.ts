import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Toast = { id: number; text: string };

type AdminUiState = {
    mode: 'dark' | 'light';
    toggleMode: () => void;
    toasts: Toast[];
    toast: (text: string) => void;
    dismiss: (id: number) => void;
};

/** Admin-only UI state. The theme is remembered in localStorage, toasts are not. */
export const useAdminUi = create<AdminUiState>()(
    persist(
        (set) => ({
            mode: 'dark',
            toggleMode: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
            toasts: [],
            toast: (text) => {
                const id = Date.now();
                set((s) => ({ toasts: [...s.toasts, { id, text }] }));
                setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 5000);
            },
            dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
        }),
        { name: 'ticketember-admin-ui', partialize: (s) => ({ mode: s.mode }) }
    )
);
