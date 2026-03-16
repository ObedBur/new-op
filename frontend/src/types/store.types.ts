
export interface StoreProduct {
  image: string;
}

export interface Store {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  verified: boolean;
  avatar: string;
  previews: StoreProduct[];
}
