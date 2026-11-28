import { mockDelay } from '@/api/mock-delay';
import { mockAdmit, mockCheckTicket, mockScans } from '@/mocks/admin';

// Admin API (all routes need the admin role). TODO: backend is not connected yet; comments name the real calls.

// Check-in: post('/admin/check-in/check', { ticketId, showtimeId }), post('/admin/check-in/admit', ...), get('/admin/check-in/scans')
export async function checkTicket({ ticketId, showtimeId }: { ticketId: string; showtimeId: string }) {
    await mockDelay(250);
    return mockCheckTicket(ticketId, showtimeId);
}
export async function admitTicket({ ticketId, showtimeId }: { ticketId: string; showtimeId: string }) {
    await mockDelay(250);
    return mockAdmit(ticketId, showtimeId);
}
export async function getScans() {
    return mockScans();
}
