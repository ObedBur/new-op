'use client';

import React, { useState } from 'react';
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
  deals?: Product[];
  newArrivals?: Product[];
  recommendations?: Product[];
  bestSellers?: Product[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({ 
  initialProducts, 
  categories, 
  deals = [],
  newArrivals = [],
  recommendations = [],
  bestSellers = []
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { filters, updateFilters } = useProductFilters();
  const { paginatedProducts, totalCount, totalPages } = useProductListView(initialProducts, filters);
  const { selectedProduct, openQuickView, closeQuickView } = useQuickView();

  return (
    <>
      <section className="py-6 container mx-auto max-w-7xl px-3 sm:px-4 animate-in fade-in duration-500">
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-8 bg-[#E67E22] rounded-full"></span>
                <span className="bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20 text-xs font-black uppercase px-2.5 py-0.5 rounded-md tracking-widest">Marketplace Afrique</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#2D5A27] dark:text-white tracking-tight leading-none">Nos Articles</h2>
        </div>
      </section>

      {/* CATÉGORIES EN FICHES */}
      <CategoriesGrid categories={categories} />

      {/* GALERIES INTELLIGENTES */}
      <section className="py-10 space-y-12">
        <div className="container mx-auto px-4">

          {/* Galerie 1: Offres du moment (Promotions) */}
          {deals.length > 0 && (
            <div className="bg-[#DDB88C]/30 rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#DDB88C]/10">
              <FeaturedProductStrip
                title="🔥 Offres du moment"
                subtitle="Promotions actives — prix réduits de plus de 15%"
                products={deals}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/* Galerie 2: Nouveautés (< 7 jours) */}
          {newArrivals.length > 0 && (
            <div className="bg-[#DDB88C]/20 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="✨ Nouveautés"
                subtitle="Publiés ces 7 derniers jours"
                products={newArrivals}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/* Galerie 3: Recommandations (basé sur historique) */}
          {recommendations.length > 0 && (
            <div className="bg-[#DDB88C]/15 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="💡 Recommandations"
                subtitle="Basé sur vos centres d'intérêt"
                products={recommendations}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/* Galerie 4: Meilleures ventes */}
          {bestSellers.length > 0 && (
            <div className="bg-[#DDB88C]/10 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="🏆 Meilleures ventes"
                subtitle="Les articles les plus commandés"
                products={bestSellers}
                onQuickView={openQuickView}
              />
            </div>
          )}
        </div>
      </section>

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

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-start animate-in fade-in duration-500">
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
    </>
  );
};
