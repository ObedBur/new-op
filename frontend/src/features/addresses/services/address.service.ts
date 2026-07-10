import api from '@/lib/api';

export interface Address {
  id: string;
  title: string;
  street: string;
  commune: string;
  city: string;
  province: string;
  country: string;
  isDefault: boolean;
}

export type CreateAddressData = Omit<Address, 'id'>;

export const AddressService = {
  async getAddresses(): Promise<Address[]> {
    const response = await api.get('/addresses');
    return response.data;
  },

  async createAddress(data: CreateAddressData): Promise<Address> {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  async updateAddress(id: string, data: Partial<CreateAddressData>): Promise<Address> {
    const response = await api.patch(`/addresses/${id}`, data);
    return response.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  }
};
