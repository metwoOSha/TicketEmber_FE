import { cancelMockOrder, createMockOrder, getMockOrder, getMockOrders, getMockUnpaidOrder, payMockOrder } from '@/mocks/orders';
import type { Order, PayResult } from '@/types/booking.types';
import { mockDelay } from '@/api/mock-delay';

// TODO: backend is not connected yet. Real calls:
// post<Order>('/orders', { sessionId, seats }), get<Order>(`/orders/${id}`), post(`/orders/${id}/pay`), ...

/** Holds the seats for 15 minutes. Rejects with ApiError 409 when a seat is already taken. */
export async function createOrder(input: { sessionId: string; seats: string[] }): Promise<Order> {
    await mockDelay();
    return createMockOrder(input.sessionId, input.seats);
}

export async function getOrder(id: string): Promise<Order | null> {
    return getMockOrder(id);
}

export async function getOrders(): Promise<Order[]> {
    return getMockOrders();
}

/** The user's pending (unpaid) order, if any. */
export async function getUnpaidOrder(): Promise<Order | null> {
    return getMockUnpaidOrder();
}

export async function payOrder(input: { id: string; simulateFail?: boolean }): Promise<PayResult> {
    await mockDelay(900);
    return payMockOrder(input.id, !!input.simulateFail);
}

export async function cancelOrder(id: string): Promise<Order> {
    await mockDelay();
    return cancelMockOrder(id);
}
