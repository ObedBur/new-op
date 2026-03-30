'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSellerById } from '@/features/home/services/seller.service';

export default function SellerDetailPage() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [isLoading, setIsLoading] = useState(true);
  const [sellerData, setSellerData] = useState<any>(null);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await getSellerById(id as string);
          setSellerData(data);
        }
      } catch (error) {
        console.error('Error fetching seller detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFullData();
  }, [id]);

  const categories = ['Tout', 'Chaussures', 'Chemises', 'Accessoires'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!sellerData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-4">
        <h2 className="text-2xl font-black text-deep-blue dark:text-white">Boutique introuvable</h2>
        <Link href="/sellers" className="text-primary font-bold hover:underline italic">Retour</Link>
      </div>
    );
  }

  const products = sellerData.products || [];

  return (
    <main className="flex-1 bg-gray-50/50 dark:bg-background-dark/50 pt-24 pb-20">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* SHOP HEADER - MINIMALIST */}
        <div className="bg-white dark:bg-[#111827] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
            {/* AVATAR SECTION */}
            <div className="relative shrink-0">
              <div className="size-24 sm:size-32 rounded-full p-1 bg-white dark:bg-[#111827] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                <Image 
                  src={sellerData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerData.boutiqueName || 'S')}&background=random&size=200`} 
                  alt={sellerData.boutiqueName} 
                  width={128} 
                  height={128} 
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
              {sellerData.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111827] p-1.5 rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-[#E67E22] text-[28px] sm:text-[32px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              )}
            </div>
            
            {/* INFO SECTION */}
            <div className="flex-1 text-center sm:text-left space-y-4 sm:space-y-6 w-full">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-deep-blue dark:text-white uppercase tracking-tight leading-tight">
                  {sellerData.boutiqueName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10 mt-4">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black text-deep-blue dark:text-white">{(sellerData.trustScore / 20).toFixed(1)}</span>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] leading-none">Score</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black text-deep-blue dark:text-white">{sellerData.productCount}</span>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] leading-none">Items</span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link 
                  href={`https://wa.me/${sellerData.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(`Bonjour ${sellerData.boutiqueName}, je suis intéressé par vos produits sur WapiBei.`)}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2D5A27] text-white rounded-2xl font-black text-sm shadow-xl shadow-green-900/20 transition-all hover:translate-y-[-2px] active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  WhatsApp
                </Link>
              {/* 
                <button className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-deep-blue dark:bg-white/5 text-white dark:text-white rounded-2xl font-black text-sm shadow-xl transition-all hover:translate-y-[-2px] active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  Suivre
                </button>
              */}
              </div>
            </div>
          </div>
        </div>

        {/* SHOP TOOLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          {/* SEARCH */}
          <div className="relative w-full sm:max-w-md group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-300 group-focus-within:text-[#E67E22] transition-colors">search</span>
            <input 
              type="text"
              placeholder="RECHERCHER..."
              className="w-full pl-14 pr-6 py-4.5 bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-deep-blue dark:text-white shadow-xl shadow-black/2 focus:outline-hidden focus:ring-4 focus:ring-orange-500/5 transition-all"
            />
          </div>

          {/* TABS */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                  ? 'bg-[#2D5A27] text-white shadow-xl shadow-green-900/20'
                  : 'bg-white dark:bg-[#111827] text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {products.map((product: any, idx: number) => (
              <div 
                key={product.id} 
                className="group bg-white dark:bg-[#111827] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-white/2">
                  <Image 
                    src={product.images?.[0] || product.image || '/images/placeholder.png'} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 sm:p-6 space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-deep-blue dark:text-white line-clamp-1 uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-lg sm:text-xl font-black text-[#E67E22] mt-1">${product.price}</p>
                  </div>

                  <Link href={`/products/${product.id}`} className="block">
                    <button className="w-full py-3 bg-[#E67E22]/10 text-[#E67E22] hover:bg-[#E67E22] hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                      VOIR
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
            <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">inventory_2</span>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucun produit en ligne</p>
          </div>
        )}

      </div>
    </main>
  );
}
