
'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '../types';
import { ProductMapper } from '../services/product.mapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/date';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  compact?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, compact = false, className = "" }) => {
  const { amount, currency } = ProductMapper.parsePrice(product.displayPrice || product.price);

  return (
    <Card 
        hoverable 
        padding="none"
      className={`flex flex-col ${compact ? 'w-[160px] md:w-[190px]' : 'w-full md:w-auto'} ${className}`}
        onClick={() => onQuickView(product)}
        role="button"
        aria-label={`Voir les détails de ${product.name}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-white/5">
        <Image 
          alt={product.name} 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          src={product.image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Badge de Localisation */}
        <div className="absolute bottom-1.5 left-1.5 z-10 max-w-[95%]">
          <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/20 shadow-lg">
            <span className="material-symbols-outlined text-[10px] md:text-[12px] text-white font-bold">location_on</span>
            <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[60px] md:max-w-none">
              {product.city}
            </span>
          </div>
        </div>

        {/* Badge "Vérifié" */}
        {product.user?.isVerified && (
          <div className="absolute top-2 right-2 z-10">
              <div className="bg-white/90 backdrop-blur-sm size-6 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                  <span className="material-symbols-outlined text-[14px] text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-2 md:p-3 flex flex-col flex-1 gap-0.5 md:gap-1">
        {/* Prix */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-[14px] md:text-[17px] font-black text-[#E67E22] leading-none tracking-tight">
                {amount}
            </span>
          <span className="text-[8px] md:text-[9px] font-black text-[#E67E22] uppercase">
                {currency}
            </span>
        </div>

        {/* Titre Produit */}
        <h4 className="text-[10px] md:text-[12px] font-black text-[#2D5A27] dark:text-gray-200 leading-tight line-clamp-2 h-[26px] md:h-[32px] group-hover:text-[#E67E22] transition-colors">
            {product.name}
        </h4>

        {/* Pied de carte */}
        <div className="mt-auto pt-1 flex items-center justify-between border-t border-gray-50 dark:border-white/5">
          <span className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-tighter truncate max-w-[45%]">
                {formatDate(product.updatedAt)}
            </span>
            <div className="flex items-center gap-0.5">
            <span className="text-[8px] md:text-[10px] font-black text-[#E67E22]">{product.user?.trustScore || 50}</span>
            <span className="material-symbols-outlined text-[8px] md:text-[10px] text-[#E67E22]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
        </div>
      </div>
    </Card>
  );
};
