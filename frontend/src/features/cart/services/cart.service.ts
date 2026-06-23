import { api } from '@/lib/axios';
import { CartItem } from '../types';

interface ServerCartItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartItem['product'];
}

const toCartItems = (items: ServerCartItem[]): CartItem[] => {
  return (items || [])
    .filter(item => item?.product?.id && item.quantity > 0)
    .map(item => ({
      product: {
        ...item.product,
        image: item.product.image || item.product.images?.[0] || '/shopping-cart.png',
      },
      quantity: item.quantity,
    }));
};

// Retry logic pour les requêtes qui échouent temporairement
const retryAsync = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 500
): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
};

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    return retryAsync(async () => {
      const response = await api.get<ServerCartItem[]>('/cart');
      return toCartItems(response.data);
    });
  },

  async addItem(productId: string, quantity: number): Promise<CartItem[]> {
    const response = await api.post<ServerCartItem[]>('/cart/items', { productId, quantity });
    return toCartItems(response.data);
  },

  async setQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    const response = await api.patch<ServerCartItem[]>(`/cart/items/${productId}`, { quantity });
    return toCartItems(response.data);
  },

  async removeItem(productId: string): Promise<CartItem[]> {
    const response = await api.delete<ServerCartItem[]>(`/cart/items/${productId}`);
    return toCartItems(response.data);
  },

  async clearCart(): Promise<CartItem[]> {
    const response = await api.delete<ServerCartItem[]>('/cart');
    return toCartItems(response.data);
  },

  async mergeCart(items: CartItem[]): Promise<CartItem[]> {
    const response = await api.post<ServerCartItem[]>('/cart/merge', {
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
    return toCartItems(response.data);
  },
};
