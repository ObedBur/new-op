'use client';

import React from 'react';
import Image from 'next/image';
import { mockProducts } from '@/features/products/data/mocks';

export default function SellersPage() {
  const sellers = Array.from(new Set(mockProducts.map(p => p.user?.boutiqueName || p.user?.fullName || 'Vendeur')))
    .map((name: string) => {
      const product = mockProducts.find(p => (p.user?.boutiqueName || p.user?.fullName || 'Vendeur') === name);
      const productCount = mockProducts.filter(p => (p.user?.boutiqueName || p.user?.fullName || 'Vendeur') === name).length;
      return {
        ...product?.user,
        name: name,
        location: product?.location,
        productCount,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`,
        rating: product?.user?.trustScore ? (product.user.trustScore / 20).toFixed(1) : "4.5", // approximate rating from trustScore
        verified: product?.user?.isVerified
      };
    });

  return (
    <main className="flex-1 pt-20">
      <section className="py-12 container mx-auto max-w-5xl px-4 animate-in fade-in duration-500">
          <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Partenaires</span>
              <h2 className="text-3xl md:text-5xl font-black text-deep-blue dark:text-white mt-2 mb-4">Nos Vendeurs Vérifiés</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Découvrez les boutiques et commerçants de confiance de toute l&apos;Afrique. Consultez leurs avis, leur localisation et leur catalogue complet.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sellers.map((seller, index) => (
                  <div key={index} className="group bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                      
                      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-blue-50 to-transparent dark:from-blue-900/10"></div>
                      
                      <div className="relative mb-4">
                          <div className="size-24 rounded-full p-1 bg-white dark:bg-[#1a1a1a] shadow-lg">
                              <Image 
                                  src={seller.image} 
                                  alt={seller.name} 
                                  width={96}
                                  height={96}
                                  className="w-full h-full rounded-full object-cover"
                              />
                          </div>
                          {seller.verified && (
                              <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-white dark:border-[#1a1a1a]" title="Vendeur vérifié">
                                  <span className="material-symbols-outlined text-[16px] block">verified</span>
                              </div>
                          )}
                      </div>

                      <h3 className="text-xl font-bold text-deep-blue dark:text-white">{seller.name}</h3>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4 mt-1">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {seller.location}
                      </div>

                      <div className="grid grid-cols-2 gap-4 w-full border-t border-b border-gray-100 dark:border-white/10 py-4 mb-6">
                          <div className="flex flex-col">
                              <span className="font-black text-lg text-deep-blue dark:text-white">{seller.rating}</span>
                              <div className="flex justify-center text-orange-400">
                                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              </div>
                              <span className="text-[10px] uppercase text-gray-400 font-bold mt-1">Avis clients</span>
                          </div>
                          <div className="flex flex-col border-l border-gray-100 dark:border-white/10">
                              <span className="font-black text-lg text-deep-blue dark:text-white">{seller.productCount}</span>
                              <span className="material-symbols-outlined text-gray-400 text-[14px] mt-1">inventory_2</span>
                              <span className="text-[10px] uppercase text-gray-400 font-bold mt-1">Produits</span>
                          </div>
                      </div>

                      <button className="w-full py-3 bg-gray-50 dark:bg-white/5 text-deep-blue dark:text-white font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20">
                          Visiter la boutique
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                  </div>
              ))}
          </div>
      </section>
    </main>
  );
}
