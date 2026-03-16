'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/features/products/types';
import { ProductCard } from '@/features/products/components/ProductCard';

interface FeaturedProductStripProps {
  title: string;
  subtitle: string;
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const FeaturedProductStrip: React.FC<FeaturedProductStripProps> = ({ title, subtitle, products, onQuickView }) => {
  return (
    <div className="w-full mb-6 bg-transparent py-4">
        <div className="container mx-auto max-w-6xl px-4 flex items-center justify-between mb-3">
            <div>
          <h3 className="text-lg font-black text-[#2D5A27] dark:text-white leading-none">{title}</h3>
          <p className="text-[10px] text-[#2D5A27]/60 font-medium mt-1">{subtitle}</p>
            </div>
            <Link 
                href="/products"
          className="flex items-center gap-1 text-slate-400 hover:text-[#E67E22] transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
        </div>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 md:gap-5">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              className="w-full"
            />
          ))}

          {/* Bouton "Tout voir" intégré à la grille */}
          <Link
            href="/products"
            className="w-full min-h-[140px] flex flex-col items-center justify-center gap-2 bg-[#2D5A27]/5 dark:bg-white/5 border border-dashed border-[#2D5A27]/20 dark:border-white/10 rounded-2xl cursor-pointer hover:border-[#E67E22] transition-all group lg:hidden"
          >
            <span className="material-symbols-outlined text-[#2D5A27]/40 group-hover:text-[#E67E22] text-3xl">arrow_circle_right</span>
            <span className="text-[11px] font-bold text-[#2D5A27]/60 uppercase tracking-tight group-hover:text-[#E67E22]">Tout voir</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
