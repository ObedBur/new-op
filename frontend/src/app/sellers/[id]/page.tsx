'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getSellerById, toggleFollowVendor } from '@/features/home/services/seller.service';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductQuickView } from '@/features/products/components/ProductQuickView';
import { Product } from '@/features/products/types';

export default function SellerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [isLoading, setIsLoading] = useState(true);
  const [sellerData, setSellerData] = useState<any>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await getSellerById(id as string);
          setSellerData(data);
          setIsFollowed(Boolean(data?.isFollowed));
        }
      } catch (error) {
        console.error('Error fetching seller detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFullData();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsTogglingFollow(true);
    try {
      const result = await toggleFollowVendor(id as string);
      if (result) {
        setIsFollowed(result.followed);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsTogglingFollow(false);
    }
  };

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

  const toProduct = (product: any): Product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    location: product.location,
    city: product.city || sellerData.city || '',
    country: product.country || sellerData.country || '',
    price: Number(product.price) || 0,
    displayPrice: product.displayPrice,
    categoryId: product.categoryId || product.category?.id || '',
    image: product.images?.[0] || product.image || '/images/placeholder.png',
    images: product.images,
    updatedAt: product.updatedAt || new Date().toISOString(),
    availability: product.availability,
    stockQuantity: product.stockQuantity,
    unit: product.unit,
    user: product.user || {
      id: sellerData.id || (id as string),
      boutiqueName: sellerData.boutiqueName,
      fullName: sellerData.fullName,
      isVerified: sellerData.isVerified,
      trustScore: sellerData.trustScore,
      phone: sellerData.phone,
      avatarUrl: sellerData.avatarUrl,
    },
  });

  const mappedProducts = products.filter((p: any) => p.isPublic).map(toProduct);

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
                <h1 className="text-3xl sm:text-4xl font-black text-deep-blue dark:text-white uppercase tracking-tight leading-none">
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
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                <button
                  onClick={handleToggleFollow}
                  disabled={isTogglingFollow}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all hover:translate-y-[-2px] active:scale-95 ${
                    isFollowed 
                      ? 'bg-gray-200 dark:bg-gray-800 text-deep-blue dark:text-white border border-gray-300 dark:border-gray-700 shadow-none' 
                      : 'bg-[#E67E22] text-white shadow-[#E67E22]/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isFollowed ? "'FILL' 1" : "'FILL' 0" }}>
                    {isFollowed ? 'person_remove' : 'person_add'}
                  </span>
                  {isTogglingFollow ? '...' : (isFollowed ? 'Ne plus suivre' : 'Suivre')}
                </button>

                <Link 
                  href={`https://wa.me/${sellerData.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${sellerData.boutiqueName}, je suis intéressé par vos produits sur WapiBei.`)}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2D5A27] text-white rounded-2xl font-black text-sm shadow-xl shadow-green-900/20 transition-all hover:translate-y-[-2px] active:scale-95"
                >
                  <svg className="shrink-0 text-[#25D366] fill-current" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </Link>
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
            {['Tout'].map((cat) => (
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
        {mappedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6">
            {mappedProducts.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
            <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">inventory_2</span>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucun produit en ligne</p>
          </div>
        )}

      </div>

      {selectedProduct && (
        <ProductQuickView 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </main>
  );
}
