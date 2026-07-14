
export interface Seller {
  id: string;
  fullName?: string;
  boutiqueName?: string;
  isVerified?: boolean;
  trustScore?: number;
  phone?: string;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  location?: string;
  city: string;
  country: string;
  price: number; // Normalized price
  displayPrice?: string;
  categoryId: string;
  image: string;
  images?: string[];
  updatedAt: string;
  availability?: 'IN_STOCK' | 'LIMITED_STOCK' | 'OUT_OF_STOCK';
  stockQuantity?: number;
  unit?: string;
  user?: Seller;
}
