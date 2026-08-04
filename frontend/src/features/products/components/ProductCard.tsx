
'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '../types';
import { ProductMapper } from '../services/product.mapper';
import { useCart } from '@/features/cart/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from 'sonner';
import { useT } from '@/i18n/useT';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  compact?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  compact = false,
  className = '',
}) => {
  const { formatPriceParts } = useCurrency();
  const { amount, symbol } = formatPriceParts(product.price);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorited } = useWishlist();
  const { t } = useT();

  const isFav = isFavorited(product.id);
  const isOutOfStock = product.availability === 'OUT_OF_STOCK' || (product.stockQuantity !== undefined && product.stockQuantity !== null && product.stockQuantity === 0);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const action = toggleFavorite(product);
    if (action === 'added') {
      toast.success(t('product.addedToFavorites').replace('{name}', product.name), { icon: '⭐️' });
    } else if (action === 'removed') {
      toast.success(t('product.removedFromFavorites').replace('{name}', product.name));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      role="button"
      aria-label={t('product.viewDetails').replace('{name}', product.name)}
      onClick={() => onQuickView(product)}
      className={[
        'group relative flex flex-col bg-white dark:bg-zinc-900',
        'rounded-2xl overflow-hidden cursor-pointer',
        'premium-shadow',
        compact ? 'w-[160px] md:w-[190px]' : 'w-full md:w-auto',
        className,
      ].join(' ')}
    >
      {/* ── ZONE IMAGE ── */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-white/5">
        <Image
          alt={product.name}
          className="object-cover img-zoom"
          src={product.image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />

        {/* Dégradé bas pour lisibilité */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-[1]" />

        {/* Badge Épuisé uniquement si stock = 0 */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 z-10">
            <div className="glass-badge bg-red-500/80 px-2 py-0.5 rounded-lg">
              <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">{t('product.outOfStock')}</span>
            </div>
          </div>
        )}

        {/* Bouton Favori — visible uniquement au hover */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 z-30 glass-badge size-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer
            opacity-0 group-hover:opacity-100
            ${isFav ? 'bg-orange-500 text-white !opacity-100' : 'bg-black/40 hover:bg-black/60 text-white'}`}
        >
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {/* Overlay actions rapides au hover */}
        <div className="card-actions-overlay absolute inset-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
          <button
            onClick={handleAddToCart}
            aria-label={t('product.addToCart')}
            className="flex items-center justify-center gap-1.5 bg-[#E67E22] hover:bg-orange-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest size-9 sm:w-auto sm:h-9 sm:px-3 sm:py-2 rounded-xl shadow-lg shadow-orange-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isOutOfStock}
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[14px]">add_shopping_cart</span>
            {!compact && <span className="hidden sm:inline">{t('product.add')}</span>}
          </button>

          <button
            onClick={handleQuickView}
            aria-label={t('product.quickView')}
            className="glass-badge bg-white/20 hover:bg-white/40 text-white size-9 rounded-xl flex items-center justify-center transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>
      </div>

      {/* ── ZONE CONTENU ── */}
      <div className="relative p-2.5 md:p-3 flex flex-col flex-1 gap-1.5">

        {/* Prix */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-[14px] md:text-[17px] font-black text-[#E67E22] leading-none tracking-tight">
            {amount}
          </span>
          <span className="text-[8px] md:text-[9px] font-black text-[#E67E22] uppercase">
            {symbol}
          </span>
          {product.unit && (
            <span className="text-[8px] md:text-[9px] font-medium text-gray-400 dark:text-gray-500 ml-0.5">
              {t('product.unitPer').replace('{unit}', product.unit)}
            </span>
          )}
        </div>

        {/* Nom du produit */}
        <h4 className="text-[10px] md:text-[12px] font-black text-[#2D5A27] dark:text-gray-200 leading-tight line-clamp-2 group-hover:text-[#E67E22] transition-colors duration-300">
          {product.name}
        </h4>

        {/* Score de confiance — sans séparateur */}
        <div className="mt-auto flex items-center gap-0.5">
          <span
            className="material-symbols-outlined text-[9px] md:text-[10px] text-[#E67E22]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-[8px] md:text-[10px] font-black text-[#E67E22]">
            {product.user?.trustScore || 50}
          </span>
        </div>
      </div>
    </div>
  );
};

