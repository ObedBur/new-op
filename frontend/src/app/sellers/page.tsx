'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveSellers, Seller } from '@/features/home/services/seller.service';

export default function SellersPage() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const data = await getActiveSellers();
                setSellers(data);
            } catch (error) {
                console.error('Error fetching sellers:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSellers();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

  return (
    <main className="flex-1 pt-20">
      <section className="py-12 container mx-auto max-w-7xl px-4 animate-in fade-in duration-500">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="text-primary font-bold text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-wider">Partenaires</span>
              <h2 className="text-2xl sm:text-5xl font-black text-deep-blue dark:text-white mt-2 mb-3 sm:mb-4 tracking-tighter">Nos Vendeurs Vérifiés</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-lg">
                  Découvrez les boutiques et commerçants de confiance de toute l&apos;Afrique.
              </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                  {sellers.map((seller) => (
                      <div key={seller.id} className="group bg-white dark:bg-[#1a1a1a] rounded-[2rem] sm:rounded-3xl p-3 sm:p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                      
                      <div className="absolute top-0 left-0 w-full h-16 sm:h-24 bg-linear-to-b from-blue-50 to-transparent dark:from-blue-900/10"></div>
                      
                      <div className="relative mb-3 sm:mb-4">
                          <div className="size-16 sm:size-24 rounded-full p-0.5 sm:p-1 bg-white dark:bg-[#1a1a1a] shadow-lg overflow-hidden border border-gray-100 dark:border-white/5">
                              <Image 
                                  src={seller.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.boutiqueName)}&background=random&size=200`}
                                  alt={seller.boutiqueName} 
                                  width={96}
                                  height={96}
                                  className="w-full h-full rounded-full object-cover"
                              />
                          </div>
                          {seller.isVerified && (
                              <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 sm:p-1 border-2 border-white dark:border-[#1a1a1a] shadow-sm" title="Vendeur vérifié">
                                  <span className="material-symbols-outlined text-[12px] sm:text-[16px] block font-bold">verified</span>
                              </div>
                          )}
                      </div>

                      <h3 className="text-xs sm:text-xl font-black text-deep-blue dark:text-white line-clamp-1 truncate uppercase tracking-tight w-full px-1">
                          {seller.boutiqueName}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-[10px] sm:text-sm text-gray-400 mb-4 mt-1 font-bold uppercase tracking-widest">
                          <span className="material-symbols-outlined text-[14px] sm:text-[16px]">location_on</span>
                          RDC
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full border-t border-b border-gray-100 dark:border-white/10 py-3 sm:py-4 mb-4 sm:mb-6">
                           <div className="flex flex-col">
                               <div className="flex items-center justify-center gap-0.5 text-orange-400">
                                   <span className="text-[12px] sm:text-lg font-black text-deep-blue dark:text-white mr-1">{(seller.trustScore / 20).toFixed(1)}</span>
                                   <span className="material-symbols-outlined text-[12px] sm:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                               </div>
                               <span className="text-[8px] sm:text-[10px] uppercase text-gray-400 font-black mt-0.5 tracking-tighter">Score</span>
                           </div>
                           <div className="flex flex-col border-l border-gray-100 dark:border-white/10">
                               <span className="font-black text-[12px] sm:text-lg text-deep-blue dark:text-white">{seller.productPreviews.length}+</span>
                               <span className="text-[8px] sm:text-[10px] uppercase text-gray-400 font-black mt-0.5 tracking-tighter">Items</span>
                           </div>
                      </div>

                      <Link 
                        href={`/sellers/${seller.id}`}
                        className="w-full py-2.5 sm:py-3.5 bg-gray-50 dark:bg-white/5 text-deep-blue dark:text-white font-black text-[10px] sm:text-sm uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                      >
                          <span className="hidden sm:inline">Visiter</span>
                          <span className="sm:hidden">Voir</span>
                          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_forward</span>
                      </Link>
                  </div>
              ))}
          </div>
      </section>
    </main>
  );
}
