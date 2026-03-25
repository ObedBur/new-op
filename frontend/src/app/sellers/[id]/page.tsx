'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProducts } from '@/features/products/services/product.service';
import { Product } from '@/types';

export default function SellerDetailPage() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // En situation réelle, on fetcherait le vendeur par son ID via un service
  // Pour l'instant, on dérive le vendeur du premier produit ou on attend une API dédiée
  const [seller, setSeller] = useState({
    id: id as string,
    name: "Chargement...",
    location: "RD Congo",
    rating: "4.5/5",
    productCount: 0,
    responseTime: "< 2h",
    isVerified: true,
    logo: `https://ui-avatars.com/api/?name=Store&background=random&size=200`,
    whatsapp: ""
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setIsLoading(true);
        // On récupère les produits de ce vendeur
        // Note: l'API devrait supporter le filtrage par boutique (userId)
        const res = await getProducts({ limit: 20 });
        if (res.success) {
          setProducts(res.data);
          if (res.data.length > 0) {
            const firstProduct = res.data[0];
            setSeller(prev => ({
              ...prev,
              name: firstProduct.user?.boutiqueName || firstProduct.user?.fullName || "Boutique",
              logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstProduct.user?.boutiqueName || "B")}&background=random&size=200`,
              productCount: res.data.length,
              isVerified: firstProduct.user?.isVerified || false
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching seller detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSellerData();
  }, [id]);

  const categories = ['Tout', 'Chaussures', 'Chemises', 'Accessoires'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50/50 dark:bg-background-dark/50 pt-24 pb-20">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* SHOP HEADER CARD */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="size-20 lg:size-28 rounded-full p-1 bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
                  <Image src={seller.logo} alt={seller.name} width={112} height={112} className="w-full h-full rounded-full object-cover" />
                </div>
                {seller.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1a1a1a] p-1 rounded-full shadow-lg">
                    <span className="material-symbols-outlined text-primary text-[24px] fill-1">verified</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-black text-deep-blue dark:text-white uppercase tracking-tight">{seller.name}</h1>
                  <span className="px-3 py-1 bg-orange-50 dark:bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                    Vendeur Vérifié
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-bold">
                  <span className="material-symbols-outlined text-[20px] text-gray-400">location_on</span>
                  {seller.location}
                </div>
                
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-deep-blue dark:text-white">{seller.rating}</span>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Note</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-deep-blue dark:text-white">{seller.productCount}</span>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Produits</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-deep-blue dark:text-white">{seller.responseTime}</span>
                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Réponse</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={`https://wa.me/${seller.whatsapp}`}
                target="_blank"
                className="flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/40 active:scale-95"
              >
                <span className="material-symbols-outlined">chat</span>
                Contacter via WhatsApp
              </Link>
              <button className="flex items-center justify-center gap-3 px-8 py-5 bg-deep-blue dark:bg-white text-white dark:text-deep-blue rounded-2xl font-black text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                <span className="material-symbols-outlined">person_add</span>
                Suivre la boutique
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          {/* Search Bar */}
          <div className="relative max-w-md w-full group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text"
              placeholder="Chercher dans cette boutique..."
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-full text-sm font-bold shadow-xl shadow-black/5 focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Categories Tab */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                  ? 'bg-primary text-white shadow-xl shadow-primary/20'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
            <button className="shrink-0 flex items-center gap-2 pl-6 pr-4 py-4 bg-white dark:bg-[#1a1a1a] text-gray-500 rounded-full border border-gray-100 dark:border-white/5 text-xs font-black uppercase tracking-widest ml-4">
              Trier par prix
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <div 
              key={product.id} 
              className="group bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-white/2">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button className="absolute top-5 right-5 size-12 rounded-2xl bg-white/90 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-lg active:scale-90">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                </button>
              </div>

              <div className="p-8 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-deep-blue dark:text-white group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-black text-primary">{product.displayPrice || `${product.price}$`}</span>
                  </div>
                </div>

                <Link href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline">
                  <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                  Comparer ailleurs
                </Link>

                <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all hover:bg-primary-dark active:scale-[0.98]">
                  Voir l&apos;offre
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* LOAD MORE */}
        <div className="mt-20 text-center">
          <button className="px-12 py-5 bg-white dark:bg-[#1a1a1a] text-deep-blue dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-black text-sm shadow-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95">
            Charger plus de produits
          </button>
        </div>

      </div>

      {/* FOOTER MINI */}
      <footer className="mt-32 border-t border-gray-100 dark:border-white/5 pt-16 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-[32px]">storefront</span>
            <span className="text-2xl font-black text-deep-blue dark:text-white">WapiBei Goma</span>
          </div>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mb-8 font-medium">
            Le marché digital numéro 1 à Goma pour comparer les prix et trouver les meilleures offres en ville.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-black uppercase tracking-widest text-gray-400">
            <Link href="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-primary transition-colors">Conditions d&apos;utilisation</Link>
            <Link href="#" className="hover:text-primary transition-colors">Aide</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
