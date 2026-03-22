'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Product } from '../types';
import { useCart } from '@/features/cart/context/CartContext';
import { formatDate } from '@/utils/date';

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle === 'hidden' ? '' : originalStyle;
    };
  }, []);

  const sellerName = product.user?.boutiqueName || product.user?.fullName || 'Vendeur WapiBei';
  const trustScore = product.user?.trustScore || 50;
  const initial = sellerName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Fond sombre flouté */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Conteneur Principal Modal */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[95vh] md:max-h-[85vh] border border-white/20">
        
        {/* Bouton Fermer Flottant */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 size-10 md:size-12 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-[#E67E22] hover:text-white transition-all duration-300 group"
        >
          <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform">close</span>
        </button>

        {/* Section Gauche : Image Immersive */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50 relative shrink-0 group">
          <Image 
            src={product.image} 
            alt={product.name} 
            className="object-cover transition-transform duration-700 md:group-hover:scale-105" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Section Droite : Contenu et Actions */}
        <div className="w-full md:w-1/2 flex flex-col h-full max-h-[calc(95vh-16rem)] md:max-h-full overflow-y-auto relative bg-white dark:bg-[#111]">
            <div className="p-6 md:p-10 flex-1 flex flex-col gap-8">
                
            {/* 1. Header du Produit */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-[#E67E22]/10 text-[#E67E22] text-[10px] font-black uppercase tracking-widest rounded-full">
                  {product.categoryId || 'Produit WapiBei'}
                         </span>
                           </span>
                         )}
                    </div>
                    
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 tracking-tighter">
                      {product.name}
                    </h2>
                    
                    <div className="flex items-baseline gap-2">
                         <span className="text-4xl md:text-5xl font-black text-[#E67E22] tracking-tighter">
                           {product.displayPrice || `${product.price}`}
                         </span>
                {!product.displayPrice && <span className="text-xl font-bold text-slate-400 uppercase">FC</span>}
                    </div>
                </div>

            {/* 2. Méta-données */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-y border-slate-100 dark:border-white/5 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#E67E22]">location_on</span>
                <span className="text-slate-900 dark:text-gray-300 font-bold">{product.city}</span>
                <span className="text-xs text-slate-400">({product.location})</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
                        Mis à jour: {formatDate(product.updatedAt)}
                    </div>
                </div>

            {/* 3. Description */}
                <div>
              <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-3">À propos de cet article</h3>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-[15px]">
                {product.description || `Cet article est disponible avec la quantité que vous désirez.`}
                    </p>
                </div>

            {/* 4. Carte du Vendeur */}
            <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/10 mt-auto">
                    <div className="flex items-center gap-4">
                <div className="size-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0">
                            {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-slate-900 dark:text-white truncate">
                                  {sellerName}
                                </span>
                                {product.user?.isVerified && (
                                    <span className="material-symbols-outlined text-blue-500 text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-[#E67E22] text-xs font-black">
                                    <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    {trustScore} Score
                    </div>
                            </div>
                </div>
                    </div>
            </div>
            </div>

          {/* 5. Pied de page d'actions : FULL WIDTH DESIGN */}
          <div className="px-6 py-5 md:px-10 md:py-8 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 sticky bottom-0 z-10 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {/* Panier */}
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-[1.5] h-14 bg-[#E67E22] hover:bg-[#d6721b] text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-[#E67E22]/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                AJOUTER AU PANIER
              </button>

              {/* WhatsApp */}
              <a 
                href={`https://wa.me/${product.user?.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Bonjour, je suis intéressé par votre produit : *${product.name}* au prix de *${product.displayPrice || product.price}*.\n\nVoici le produit : ${product.image}`
                )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                className="flex-1 w-full h-14 border-2 border-[#25D366]/40 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                <span>WHATSAPP</span>
              </a>
                 </div>
          </div>
        </div>
      </div>
    </div>
  );
};
