export class SellerDto {
  id: string;
  boutiqueName: string;
  trustScore: number;
  isVerified: boolean;
  avatarUrl?: string;
  productPreviews: string[];
  productCount: number;
  salesCount: number;
  isOnline: boolean;
  lastSeenAt?: Date | null;
}
