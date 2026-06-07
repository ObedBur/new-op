'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, Category } from '../types';
import { Badge } from '@/components/ui/Badge';
import { CategoriesGrid } from '@/features/home/components/CategoriesGrid';
import { FeaturedProductStrip } from '@/features/home/components/FeaturedProductStrip';
import { 
  ProductGrid, 
  ProductFilterSidebar, 
  ProductFilterMobile, 
  ProductSortSelect, 
  ProductPagination,
  ProductQuickView
} from './index';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProductListView } from '../hooks/useProductListView';
import { useQuickView } from '../hooks/useQuickView';

interface ProductsViewProps {
  initialProducts: Product[];
  categories: Category[];
  searchTerm?: string;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ 
  initialProducts, 
  categories, 
  searchTerm
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { filters, updateFilters } = useProductFilters();
  const { paginatedProducts, totalCount, totalPages } = useProductListView(initialProducts, filters);
  const { selectedProduct, openQuickView, closeQuickView } = useQuickView();

  return (
    <>
      {/* SECTION TOUS NOS ARTICLES */}
      <section className="py-10 container mx-auto max-w-7xl px-3 sm:px-4">
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-8 bg-[#E67E22] rounded-full"></span>
                <span className="bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20 text-xs font-black uppercase px-2.5 py-0.5 rounded-md tracking-widest">Complete</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#2D5A27] dark:text-white tracking-tight leading-none">Tous nos articles</h2>
            <p className="text-slate-500 text-sm font-medium mt-2">Parcourez l'ensemble de notre catalogue avec les filtres avancés</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start animate-in fade-in duration-500">
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
                  currency={filters.currency}
                  onCurrencyChange={(currency) => updateFilters({ currency })}
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
      </section>

        <AnimatePresence>
          {isMobileFiltersOpen && (
            <ProductFilterMobile 
              isOpen={isMobileFiltersOpen} 
              onClose={() => setIsMobileFiltersOpen(false)} 
              categories={categories} 
              filters={filters} 
              onUpdate={updateFilters} 
            />
          )}
        </AnimatePresence>

        {selectedProduct && (
          <ProductQuickView 
            product={selectedProduct} 
            onClose={closeQuickView} 
          />
        )}
    </>
  );
};
