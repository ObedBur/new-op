
export interface Seller {
  fullName?: string;
  boutiqueName?: string;
  isVerified?: boolean;
  trustScore?: number;
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
  availability?: 'IN_STOCK' | 'LIMITED_STOCK' | 'ON_ORDER';
  market: string;
  user?: Seller;
}
