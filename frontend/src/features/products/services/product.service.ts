import { api } from '@/lib/axios';
import { Product, Category } from '../types';
import { ApiResponse } from '@/types/api';

export async function getProducts(params?: {
  categoryId?: number;
  search?: string;
  market?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Product[]>> {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      data: [],
      message: "Erreur lors de la récupération des produits",
    };
  }
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      data: [],
      message: "Erreur lors de la récupération des catégories",
    };
  }
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  try {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}
