'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { cancelOrder, createOrder, getOrder, getOrders, getUnpaidOrder, payOrder } from '@/api/Orders.api';

export function useOrder(id: string) {
    return useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id) });
}

export function useOrders() {
    return useQuery({ queryKey: ['orders'], queryFn: getOrders });
}

export function useUnpaidOrder(enabled = true) {
    return useQuery({ queryKey: ['unpaid-order'], queryFn: getUnpaidOrder, enabled });
}

export function useCreateOrder() {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: (order) => {
            void queryClient.invalidateQueries({ queryKey: ['unpaid-order'] });
            router.push(`/checkout/${order.id}`);
        },
    });
}

export function usePayOrder() {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payOrder,
        onSuccess: (result, { id }) => {
            void queryClient.invalidateQueries({ queryKey: ['order', id] });
            void queryClient.invalidateQueries({ queryKey: ['unpaid-order'] });
            void queryClient.invalidateQueries({ queryKey: ['orders'] });
            router.push(`/result/${id}?status=${result.status}`);
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelOrder,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['unpaid-order'] });
            void queryClient.invalidateQueries({ queryKey: ['orders'] });
            void queryClient.invalidateQueries({ queryKey: ['order'] });
            void queryClient.invalidateQueries({ queryKey: ['seat-map'] });
        },
    });
}
