'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, Category } from '../types';
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
}

export const ProductsView: React.FC<ProductsViewProps> = ({ 
  initialProducts, 
  categories,
}) => {
  const categoriesWithCounts = React.useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      productCount: initialProducts.filter(p => String(p.categoryId) === String(cat.id)).length
    }));
  }, [categories, initialProducts]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { filters, updateFilters } = useProductFilters();
  const { paginatedProducts, totalCount, totalPages } = useProductListView(initialProducts, filters);
  const { selectedProduct, openQuickView, closeQuickView } = useQuickView();

  return (
    <>
      {/* SECTION TOUS NOS ARTICLES */}
      <section className="pt-4 pb-10 container mx-auto max-w-7xl px-3 sm:px-4">
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-8 bg-[#E67E22] rounded-full"></span>
                <span className="bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20 text-xs font-black uppercase px-2.5 py-0.5 rounded-md tracking-widest">
                  {filters.search ? 'Recherche' : 'Complete'}
                </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#2D5A27] dark:text-white tracking-tight leading-none">
              {filters.search ? `Résultats pour "${filters.search}"` : 'Tous nos articles'}
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-2">
              {filters.search ? `${totalCount} produit${totalCount !== 1 ? 's' : ''} trouvé${totalCount !== 1 ? 's' : ''}` : 'Parcourez l\'ensemble de notre catalogue avec les filtres avancés'}
            </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start animate-in fade-in duration-500">
            <ProductFilterSidebar 
              categories={categoriesWithCounts} 
              filters={filters} 
              onUpdate={updateFilters} 
            />

            <div className="flex-1 w-full">
                <ProductSortSelect 
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
      </section>

        <AnimatePresence>
          {isMobileFiltersOpen && (
            <ProductFilterMobile 
              isOpen={isMobileFiltersOpen} 
              onClose={() => setIsMobileFiltersOpen(false)} 
              categories={categoriesWithCounts} 
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
