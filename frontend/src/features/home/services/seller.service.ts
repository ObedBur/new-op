import { api } from '@/lib/axios';

export interface HomeSeller {
  id: string;
  boutiqueName: string;
  trustScore: number;
  isVerified: boolean;
  avatarUrl?: string;
  productPreviews: string[];
}

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
