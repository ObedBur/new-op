export type PriceRangeLabel = 'all' | 'under_25k' | '25k_75k' | 'over_75k';
export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

export interface ProductFilters {
  categoryId: string | null;
  priceRange: PriceRangeLabel;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
  page: number;
}
