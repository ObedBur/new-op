import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface Order {
  id: string;
  customerName?: string;
  customerPhone?: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  product?: {
    name: string;
    image?: string;
    images?: string[];
  };
}

// ====== COMMANDES VENDEURS ======

export async function getVendorOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const response = await api.get<ApiResponse<Order[]>>('/orders/vendor');
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    return { success: false, data: [], message: 'Erreur' };
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<unknown>> {
  try {
    const response = await api.post<ApiResponse<unknown>>(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error);
    throw error;
  }
}
