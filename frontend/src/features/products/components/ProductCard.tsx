
'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '../types';
import { ProductMapper } from '../services/product.mapper';
import { useCart } from '@/features/cart/context/CartContext';
import { formatDate } from '@/utils/date';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  compact?: boolean;
  className?: string;
}

/**
 * Retourne l'icône Material Symbols selon la catégorie du produit.
 * Permet une identification visuelle rapide sans modifier les couleurs WapiBei.
 */
function getCategoryIcon(categoryId: string | number): string {
  const id = String(categoryId).toLowerCase();
  if (id.includes('alim') || id.includes('food') || id === '1') return 'nutrition';
  if (id.includes('elec') || id.includes('tech') || id === '2') return 'devices';
  if (id.includes('mode') || id.includes('cloth') || id === '3') return 'checkroom';
  if (id.includes('maison') || id.includes('home') || id === '4') return 'chair';
  if (id.includes('beaute') || id.includes('beauty') || id === '5') return 'spa';
  if (id.includes('service') || id === '6') return 'handyman';
  if (id.includes('agri') || id === '7') return 'grass';
  return 'category';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  compact = false,
  className = '',
}) => {
  const { amount, currency } = ProductMapper.parsePrice(product.displayPrice || product.price);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorited } = useWishlist();
  
  const isFav = isFavorited(product.id);
  const categoryIcon = getCategoryIcon(product.categoryId);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const action = toggleFavorite(product);
    if (action === 'added') {
      toast.success(`${product.name} ajouté aux favoris !`, {
        icon: '⭐️'
      });
    } else if (action === 'removed') {
      toast.success(`${product.name} retiré des favoris.`);
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
      aria-label={`Voir les détails de ${product.name}`}
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

        {/* Dégradé bas pour lisibilité des badges */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-[1]" />

        {/* Badge État du Stock — glassmorphism */}
        <div className="absolute top-2 left-2 z-10">
          {product.stockQuantity === 0 ? (
            <div className="glass-badge bg-red-500/80 px-2 py-0.5 rounded-lg">
              <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">Épuisé</span>
            </div>
          ) : product.stockQuantity !== null &&
            product.stockQuantity !== undefined &&
            product.stockQuantity <= 5 ? (
            <div className="glass-badge bg-[#E67E22]/80 px-2 py-0.5 rounded-lg">
              <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">Stock Limité</span>
            </div>
          ) : (
            <div className="glass-badge bg-[#2D5A27]/80 px-2 py-0.5 rounded-lg">
              <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest">En Stock</span>
            </div>
          )}
        </div>

        {/* Top-Right Badge Stack (Verified + Favorite) */}
        <div className="absolute top-2 right-2 z-30 flex flex-col gap-2">
          {product.user?.isVerified && (
            <div className="glass-badge bg-white/25 size-8 rounded-full flex items-center justify-center shadow-sm">
              <span
                className="material-symbols-outlined text-[15px] text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          )}

          {/* Interactive Favorite Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`glass-badge size-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
              isFav 
                ? 'bg-orange-500 text-white' 
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Badge Localisation — glassmorphism */}
        <div className="absolute bottom-2 left-2 z-10 max-w-[90%]">
          <div className="glass-badge bg-black/50 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md">
            <span className="material-symbols-outlined text-[10px] text-white">location_on</span>
            <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-tight truncate max-w-[70px] md:max-w-none">
              {product.city}
            </span>
          </div>
        </div>

        {/* ── OVERLAY ACTIONS RAPIDES (visible au hover) ── */}
        <div className="card-actions-overlay absolute inset-0 z-20 flex items-center justify-center gap-2">
          {/* Ajout au panier rapide */}
          <button
            onClick={handleAddToCart}
            aria-label="Ajouter au panier"
            className="flex items-center gap-1.5 bg-[#E67E22] hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-lg shadow-orange-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.stockQuantity === 0}
          >
            <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
            {!compact && <span>Ajouter</span>}
          </button>

          {/* Vue rapide */}
          <button
            onClick={handleQuickView}
            aria-label="Vue rapide"
            className="glass-badge bg-white/20 hover:bg-white/40 text-white size-9 rounded-xl flex items-center justify-center transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>
      </div>

      {/* ── ZONE CONTENU ── */}
      <div className="relative p-2.5 md:p-3 flex flex-col flex-1 gap-1">

        {/* Ligne : icône catégorie + prix + unité */}
        <div className="flex items-center justify-between gap-1">
          {/* Icône catégorie adaptative */}
          <span className="material-symbols-outlined text-[11px] md:text-[13px] text-[#2D5A27] dark:text-[#2D5A27] opacity-50">
            {categoryIcon}
          </span>

          {/* Prix + Unité */}
          <div className="flex items-baseline gap-0.5 ml-auto">
            <span className="text-[14px] md:text-[17px] font-black text-[#E67E22] leading-none tracking-tight">
              {amount}
            </span>
            <span className="text-[8px] md:text-[9px] font-black text-[#E67E22] uppercase">
              {currency}
            </span>
            {product.unit && (
              <span className="text-[8px] md:text-[9px] font-medium text-gray-400 dark:text-gray-500 ml-0.5">
                /{product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Titre Produit */}
        <h4 className="text-[10px] md:text-[12px] font-black text-[#2D5A27] dark:text-gray-200 leading-tight line-clamp-2 h-[26px] md:h-[32px] group-hover:text-[#E67E22] transition-colors duration-300">
          {product.name}
        </h4>

        {/* Pied : date + score de confiance */}
        <div className="mt-auto pt-1.5 flex items-center justify-between border-t border-black/5 dark:border-white/5">
          <span className="text-[8px] md:text-[9px] text-gray-400 font-medium uppercase tracking-tighter truncate max-w-[50%]">
            {formatDate(product.updatedAt)}
          </span>
          <div className="flex items-center gap-0.5">
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
    </div>
  );
};
