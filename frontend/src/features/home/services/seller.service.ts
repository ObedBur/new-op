import { api } from '@/lib/api';

export interface Seller {
  id: string;
  boutiqueName: string;
  trustScore: number;
  isVerified: boolean;
  avatarUrl?: string;
  productPreviews: string[];
}

export async function getActiveSellers(): Promise<Seller[]> {
  try {
    const response = await api.get('/sellers');
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
