'use client';

import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Badge } from '@/components/ui/Badge';
import { 
  ProductGrid, 
  ProductFilterSidebar, 
  ProductFilterMobile, 
  ProductSortSelect, 
  ProductPagination,
  ProductQuickView,
  ProductSubHeader
} from './index';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProductListView } from '../hooks/useProductListView';
import { useQuickView } from '../hooks/useQuickView';

interface ProductsViewProps {
  initialProducts: Product[];
  categories: Category[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({ initialProducts, categories }) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { filters, updateFilters } = useProductFilters();
  const { paginatedProducts, totalCount, totalPages } = useProductListView(initialProducts, filters);
  const { selectedProduct, openQuickView, closeQuickView } = useQuickView();

  return (
    <>
      <ProductSubHeader categories={categories} />
      <section className="py-6 container mx-auto max-w-7xl px-3 sm:px-4 animate-in fade-in duration-500">
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-8 bg-[#E67E22] rounded-full"></span>
                <span className="bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20 text-xs font-black uppercase px-2.5 py-0.5 rounded-md tracking-widest">Marketplace Afrique</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#2D5A27] dark:text-white tracking-tight leading-none">Nos Articles</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-start">
            <ProductFilterSidebar 
              categories={categories} 
              filters={filters} 
              onUpdate={updateFilters} 
            />

            <div className="flex-1 w-full">
                <ProductSortSelect 
                  value={filters.sortBy} 
                  onChange={(val) => updateFilters({ sortBy: val })} 
                  count={totalCount}
                  onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
                />

                <ProductGrid 
                  products={paginatedProducts} 
                  onQuickView={openQuickView} 
                />

                <ProductPagination 
                  currentPage={filters.page} 
                  totalPages={totalPages} 
                  onPageChange={(p) => updateFilters({ page: p })} 
                />
            </div>
        </div>

        <ProductFilterMobile 
          isOpen={isMobileFiltersOpen} 
          onClose={() => setIsMobileFiltersOpen(false)} 
          categories={categories} 
          filters={filters} 
          onUpdate={updateFilters} 
        />

        {selectedProduct && (
          <ProductQuickView 
            product={selectedProduct} 
            onClose={closeQuickView} 
          />
        )}
    </section>
    </>
  );
};
