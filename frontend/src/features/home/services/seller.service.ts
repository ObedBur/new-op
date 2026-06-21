import { api } from '@/lib/axios';

export interface HomeSeller {
  id: string;
  boutiqueName: string;
  trustScore: number;
  isVerified: boolean;
  avatarUrl?: string;
  productPreviews: string[];
}

// Backward-compatible alias used across older UI modules
export type Seller = HomeSeller;

export async function getActiveSellers(): Promise<HomeSeller[]> {
  try {
    const response = await api.get<HomeSeller[]>('/sellers');
    return response.data;
  } catch (error) {
    console.error('Error fetching active sellers:', error);
    return [];
  }
}

export async function getSellerById(id: string): Promise<any> {
  try {
    const response = await api.get(`/sellers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching seller detail:', error);
    return null;
  }
}

export async function toggleFollowVendor(id: string): Promise<{ followed: boolean } | null> {
  try {
    const response = await api.post(`/sellers/${id}/follow`);
    return response.data;
  } catch (error) {
    console.error('Error toggling follow:', error);
    return null;
  }
}
