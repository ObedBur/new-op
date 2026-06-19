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

export const vendorsService = {
  /**
   * Fetch all vendors with optional filters
   */
  async getAllVendors(params: Partial<VendorsFilter> = {}): Promise<User[]> {
    const queryParams = { ...params, role: 'VENDOR' };
    const response = await api.get<ApiResponse<User[]>>('/admin/users', { params: queryParams });
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch vendors');
    }
    return response.data.data;
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
