import { create } from 'zustand';

export type SeatSelection = {
    sessionId: string;
    movieTitle: string;
    /** ISO string */
    startsAt: string;
    seats: string[];
};

type BookingState = {
    selection: SeatSelection | null;
    setSelection: (selection: SeatSelection | null) => void;
};

/** Seats picked before the user logged in, so login can say what is waiting. */
export const useBookingStore = create<BookingState>((set) => ({
    selection: null,
    setSelection: (selection) => set({ selection }),
}));
