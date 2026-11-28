import { mockDelay } from '@/api/mock-delay';
import { mockHalls, mockSaveHall } from '@/mocks/admin';
import type { Hall } from '@/types/admin.types';

// Admin API (all routes need the admin role). TODO: backend is not connected yet; comments name the real calls.

// Halls: get('/admin/halls'), put(`/admin/halls/${id}`)
export async function getHalls() {
    await mockDelay();
    return mockHalls();
}
export async function saveHall(hall: Hall) {
    await mockDelay(500);
    return mockSaveHall(hall);
}
