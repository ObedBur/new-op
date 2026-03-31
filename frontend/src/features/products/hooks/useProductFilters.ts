'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ProductFilters, PriceRangeLabel, SortOption } from '../types';

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo((): ProductFilters => ({
    categoryId: searchParams.get('category') || null,
    priceRange: (searchParams.get('priceRange') as PriceRangeLabel) || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: (searchParams.get('sortBy') as SortOption) || 'relevance',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    currency: (searchParams.get('currency') as 'USD' | 'FRF') || 'USD',
    vendorAssurance: searchParams.get('vendorAssurance') === 'true',
    vendorVerified: searchParams.get('vendorVerified') === 'true',
    productReadyToShip: searchParams.get('productReadyToShip') === 'true',
    productSamples: searchParams.get('productSamples') === 'true',
    conditionNew: searchParams.get('conditionNew') === 'true',
    conditionUsed: searchParams.get('conditionUsed') === 'true',
  }), [searchParams]);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === '' || (key === 'page' && value === 1) || (typeof value === 'boolean' && !value)) {
        params.delete(key === 'categoryId' ? 'category' : key);
      } else {
        params.set(key === 'categoryId' ? 'category' : key, String(value));
      }
    });

    // Reset pagination on filter change unless it's an explicit page change
    if (!newFilters.hasOwnProperty('page')) {
      params.delete('page');
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
