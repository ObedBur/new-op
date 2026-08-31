import { api } from '@/lib/axios';
import axios from 'axios';

export interface CompareProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  displayPrice: string | null;
  image: string | null;
  images: string[];
  availability: string;
  stockQuantity?: number;
  unit?: string | null;
  city: string;
  country: string;
  location: string | null;
  user: {
    id: string;
    fullName: string;
    boutiqueName: string | null;
    isVerified: boolean;
    trustScore: number;
    phone: string;
    city: string | null;
    province: string;
    avatarUrl: string | null;
  };
  category: {
    id: number;
    name: string;
  };
}

export interface CompareStats {
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface CompareResult {
  success: boolean;
  query: string;
  stats?: CompareStats;
  products: CompareProduct[];
}

export async function compareProducts(search: string, signal?: AbortSignal): Promise<CompareResult> {
  try {
    const response = await api.get<CompareResult>('/products/compare', {
      params: { search },
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return {
        success: false,
        query: search,
        products: [],
      };
    }

    console.error('Erreur comparaison:', error);
    return {
      success: false,
      query: search,
      products: [],
    };
  }
}