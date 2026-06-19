'use client';

import { useMemo } from 'react';
import { Product, ProductFilters } from '../types';
import { PRODUCT_CONFIG } from '../constants';

export function useProductListView(products: Product[], filters: ProductFilters) {
  const filteredAndSorted = useMemo(() => {
    const { UNDER_25K, OVER_75K } = PRODUCT_CONFIG.PRICE_PRESETS;

    const filtered = products.filter(product => {
      if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
      
      if (filters.priceRange !== 'all') {
        if (filters.priceRange === 'under_25k' && product.price >= UNDER_25K) return false;
        if (filters.priceRange === '25k_75k' && (product.price < UNDER_25K || product.price > OVER_75K)) return false;
        if (filters.priceRange === 'over_75k' && product.price <= OVER_75K) return false;
      }
      
      const min = parseFloat(filters.minPrice);
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(min) && product.price < min) return false;
      if (!isNaN(max) && product.price > max) return false;
      
      return true;
    });

    const result = [...filtered];

    switch (filters.sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => b.id.localeCompare(a.id)); break;
      default: break;
    }
    return result;
  }, [products, filters]);

  const { ITEMS_PER_PAGE } = PRODUCT_CONFIG;
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  
  const paginatedProducts = useMemo(() => {
    return filteredAndSorted.slice(
      (filters.page - 1) * ITEMS_PER_PAGE,
      filters.page * ITEMS_PER_PAGE
    );
  }, [filteredAndSorted, filters.page, ITEMS_PER_PAGE]);

  return {
    paginatedProducts,
    totalCount: filteredAndSorted.length,
    totalPages,
  };
}
