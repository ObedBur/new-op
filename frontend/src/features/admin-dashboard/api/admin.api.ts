import { api } from '@/lib/axios';
import { User } from '@/types';
import { ApiResponse } from '@/core/contracts/api.contract';
import { AdminStats } from '@/core/contracts/admin.contract';
import { BackendProduct } from '@/core/contracts/product.contract';
import { Activity } from '@/features/admin-dashboard/types';

export const adminService = {
  // Get all users with filters
  async getAllUsers(params: {
    role?: string;
    kycStatus?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get<ApiResponse<User[]>>('/admin/users', { params });
    return response.data;
  },

  // Get users with pending KYC
  async getPendingKyc() {
    const response = await api.get<ApiResponse<User[]>>('/admin/kyc/pending');
    return response.data;
  },

  // Delete a specific user
  async deleteUser(userId: string) {
    const response = await api.delete<ApiResponse<unknown>>(`/admin/users/${userId}`);
    return response.data;
  },

  // Update KYC status for a vendor
  async updateKycStatus(userId: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
    const response = await api.put<ApiResponse<unknown>>(`/admin/users/${userId}/kyc`, {
      status,
      rejectionReason
    });
    return response.data;
  },

  // Get admin stats for dashboard
  async getDashboardStats() {
    const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    return response.data;
  },

  // Get products with filters
  async getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    market?: string;
  }) {
    const response = await api.get<ApiResponse<BackendProduct[]>>('/products', { params }); 
    return response.data;
  },

  // Get recent activities for the admin dashboard
  async getRecentActivities() {
    const response = await api.get<ApiResponse<Activity[]>>('/admin/activities');
    return response.data;
  }
};

