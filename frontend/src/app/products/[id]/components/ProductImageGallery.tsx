'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  mainImage: string;
  images?: string[];
  productName: string;
  availability?: string;
}

// Mock additional images for visual richness when only 1 image is available
const MOCK_ANGLES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
];

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  mainImage,
  images,
  productName,
  availability,
}) => {
  // Build gallery: real images first, then mocks to fill up to 4 thumbs
  const realImages = [mainImage, ...(images || [])].filter(Boolean);
  const mockFills = MOCK_ANGLES.filter(m => !realImages.includes(m));
  const gallery = realImages.length >= 3 ? realImages : [...realImages, ...mockFills].slice(0, 4);

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const isOutOfStock = availability === 'OUT_OF_STOCK';
  const isLowStock = availability === 'LIMITED_STOCK';

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (zoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [zoomed]);

  // Handle escape key for lightbox
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 w-full">
      {/* Thumbnails — left on desktop, bottom row on mobile */}
      <div className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible md:w-20 shrink-0">
        {gallery.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              active === i
                ? 'border-[#E67E22] shadow-md shadow-orange-500/20 scale-105'
                : 'border-gray-200 dark:border-white/10 hover:border-[#E67E22]/50 opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${productName} - vue ${i + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="relative flex-1 aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 cursor-zoom-in group"
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={gallery[active]}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className={`object-contain p-4 transition-transform duration-700 ${zoomed ? 'scale-125' : 'group-hover:scale-105'}`}
          priority
        />

        {/* Availability badge */}
        <div className="absolute top-4 left-4 z-10">
          {isOutOfStock ? (
            <span className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              Épuisé
            </span>
          ) : isLowStock ? (
            <span className="px-3 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
              Stock Faible
            </span>
          ) : (
            <span className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              En Stock
            </span>
          )}
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2 py-1 bg-black/50 text-white text-[9px] font-bold rounded-lg backdrop-blur-sm">
            Clic pour zoomer
          </span>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-4">
          <span className="px-2 py-1 bg-black/40 text-white text-[10px] font-black rounded-lg backdrop-blur-sm">
            {active + 1} / {gallery.length}
          </span>
        </div>

        {/* Nav arrows */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActive(i => (i - 1 + gallery.length) % gallery.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-[#E67E22] hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActive(i => (i + 1) % gallery.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-[#E67E22] hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </>
        )}
      </div>
    </div>

    {/* LIGHTBOX OVERLAY */}
    {zoomed && (
      <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
        <button
          onClick={() => setZoomed(false)}
          className="absolute top-6 right-6 z-50 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">close</span>
        </button>

        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          <Image
            src={gallery[active]}
            alt={`${productName} - Zoomed`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Lightbox nav arrows */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={() => setActive(i => (i - 1 + gallery.length) % gallery.length)}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 size-12 md:size-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <span className="material-symbols-outlined text-[32px] md:text-[40px]">chevron_left</span>
            </button>
            <button
              onClick={() => setActive(i => (i + 1) % gallery.length)}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 size-12 md:size-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <span className="material-symbols-outlined text-[32px] md:text-[40px]">chevron_right</span>
            </button>
          </>
        )}

        {/* Lightbox Counter */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="px-4 py-2 bg-white/10 text-white text-sm font-bold tracking-widest rounded-full backdrop-blur-sm">
            {active + 1} / {gallery.length}
          </span>
        </div>
      </div>
    )}
    </>
  );
};
