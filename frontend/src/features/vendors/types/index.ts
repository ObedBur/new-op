export * from '@/types'; // Import global types

export interface VendorsState {
  searchQuery: string;
  filterStatus: 'Tous' | 'PENDING' | 'APPROVED' | 'REJECTED';
}
