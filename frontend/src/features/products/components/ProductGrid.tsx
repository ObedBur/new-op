'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onQuickView, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-2xl aspect-[3/4] animate-pulse border border-gray-100 dark:border-white/5" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-white/10 text-center px-6">
          <span className="material-symbols-outlined text-4xl text-gray-200 mb-4">search_off</span>
          <h3 className="text-lg font-black text-[#2D5A27] dark:text-white">Aucun résultat</h3>
          <p className="text-xs text-gray-400 mt-2">Essayez de modifier vos filtres.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6">
      {products.map((product) => (
        <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
