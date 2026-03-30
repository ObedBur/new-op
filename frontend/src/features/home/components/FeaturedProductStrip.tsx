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
    <div className="w-full mb-8 bg-transparent">
      <div className="container mx-auto px-4 flex items-end justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-lg md:text-xl font-black text-slate-900 leading-none">
            {title.split(' ')[0]} <span className="text-[#E67E22]">{title.split(' ').slice(1).join(' ')}</span>
          </h3>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 group text-slate-400 hover:text-white transition-all duration-300"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Voir tout</span>
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        {/* Grille compacte : 2 sur mobile, 6 sur PC/Mac */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2.5 md:gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              className="w-full transform transition hover:-translate-y-1 hover:shadow-xl rounded-2xl"
            />
          ))}

          {/* Card "Tout voir" plus élégante sur mobile */}
          <Link
            href="/products"
            className="w-full min-h-[160px] flex flex-col items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-[#E67E22]/50 hover:bg-white transition-all group lg:hidden"
          >
            <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#E67E22] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-[#E67E22]">Tout voir</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
