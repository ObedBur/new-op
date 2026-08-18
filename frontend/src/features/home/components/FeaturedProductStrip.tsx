'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/features/products/types';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useT } from '@/i18n/useT';

interface FeaturedProductStripProps {
  title: string;
  subtitle: string;
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const FeaturedProductStrip: React.FC<FeaturedProductStripProps> = ({ title, subtitle, products, onQuickView }) => {
  const { t } = useT();
  return (
    <div className="w-full mb-8 bg-transparent">
      {(title || subtitle) && (
        <div className="flex items-end justify-between mb-4">
          <div className="space-y-0.5">
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-none">
              {title.split(' ')[0]} <span className="text-[#E67E22]">{title.split(' ').slice(1).join(' ')}</span>
            </h3>
            {subtitle && <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 group text-slate-400 hover:text-white transition-all duration-300"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{t('home.productStrip.viewAll')}</span>
          </Link>
        </div>
      )}

      <div>
        {/* Grille RESPONSIVE adaptée : densité max 5 colonnes pour ne pas écraser les cartes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-3.5 md:gap-5">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              className="w-full transform transition hover:-translate-y-1 hover:shadow-xl rounded-[1.75rem]"
            />
          ))}

          {/* Card "Tout voir" plus élégante sur mobile */}
          <Link
            href="/products"
            className="w-full flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[1.75rem] cursor-pointer hover:border-[#E67E22]/50 dark:hover:border-[#E67E22]/50 hover:bg-white dark:hover:bg-white/10 transition-all group lg:hidden aspect-[4/5]"
          >
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight group-hover:text-[#E67E22] dark:group-hover:text-[#E67E22]">{t('home.productStrip.viewAllMobile')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
