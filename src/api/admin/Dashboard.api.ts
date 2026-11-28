import { mockDelay } from '@/api/mock-delay';
import { mockDashboard } from '@/mocks/admin';
import type { Period } from '@/types/admin.types';

// Admin API (all routes need the admin role). TODO: backend is not connected yet; comments name the real calls.
// get<DashboardData>(`/admin/dashboard?period=${period}`)

export async function getDashboard(period: Period) {
    await mockDelay();
    return mockDashboard(period);
}
