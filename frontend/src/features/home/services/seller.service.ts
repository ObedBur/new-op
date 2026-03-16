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
    const sellers = await api.get('/sellers');
    return sellers;
  } catch (error) {
    console.error('Error fetching active sellers:', error);
    return [];
  }
}
