import { mockDelay } from '@/api/mock-delay';
import { mockCancelOrder, mockOrders } from '@/mocks/admin';
import type { OrderFilter } from '@/types/admin.types';

// Admin API (all routes need the admin role). TODO: backend is not connected yet; comments name the real calls.

// Orders: get('/admin/orders?status=&q=&sort=&page='), post(`/admin/orders/${id}/cancel`)
export async function getOrders(filter: OrderFilter) {
    await mockDelay();
    return mockOrders(filter);
}
export async function cancelOrder(orderId: string) {
    await mockDelay(600);
    return mockCancelOrder(orderId);
}
