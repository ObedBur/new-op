import { api } from '@/lib/axios'; // We assume this exists based on admin.api.ts
import { User, KycStatus, ApiResponse } from '@/types';

// Define Feature-Specific Types (that are not global)
export interface VendorsFilter {
  role: 'VENDOR';
  kycStatus?: KycStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface VendorsPage {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const vendorsService = {
  /**
   * Fetch vendors with optional filters and pagination
   */
  async getAllVendors(params: Partial<VendorsFilter> = {}): Promise<VendorsPage> {
    const queryParams = { ...params, role: 'VENDOR' };
    const response = await api.get<ApiResponse<User[]>>('/admin/users', { params: queryParams });
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch vendors');
    }
    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        page: 1,
        limit: response.data.data.length,
        total: response.data.data.length,
        pages: 1,
      },
    };
  },

  /**
   * Fetch users with pending KYC status
   */
  async getPendingVendors(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/admin/kyc/pending');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch pending vendors');
    }
    // API returns User[] directly in data according to previous patterns, 
    // but the ApiResponse type wraps it. 
    // Checking admin.api.ts: return response.data (which is ApiResponse<User[]>).
    // The previous code in useVendors used response.success ? response.data : []
    // So the data property of the response body is the array.
    
    return response.data.data;
  },
   // Update KYC status for a specific vendor

  async updateKycStatus(userId: string, status: KycStatus, rejectionReason?: string): Promise<void> {
    const response = await api.put<ApiResponse<unknown>>(`/admin/users/${userId}/kyc`, {
      status,
      rejectionReason
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update KYC status');
    }
  }
};
