'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { mockProducts } from '@/features/products/data/mocks';
import { Product } from '@/types';

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "4"]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const maxSlots = 4;

  const comparedProducts = useMemo(() => {
    return selectedIds.map(id => mockProducts.find(p => p.id === id)).filter(Boolean) as Product[];
  }, [selectedIds]);

  const bestPriceId = useMemo(() => {
    if (comparedProducts.length < 2) return null;
    const prices = comparedProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    return comparedProducts.find(p => p.price === minPrice)?.id;
  }, [comparedProducts]);

  const searchResults = mockProducts.filter(p => 
    !selectedIds.includes(p.id) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (id: string) => {
    if (selectedIds.length < maxSlots) {
      setSelectedIds([...selectedIds, id]);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const removeProduct = (id: string) => {
    setSelectedIds(selectedIds.filter(pid => pid !== id));
  };

  return (
    <main className="flex-1 pt-20">
      <section className="py-6 md:py-16 container mx-auto max-w-7xl px-3 sm:px-4 animate-in fade-in duration-500">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
              <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="h-0.5 w-6 bg-primary"></span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Outil d&apos;aide à l&apos;achat</span>
                  </div>
                  <h2 className="text-3xl md:text-6xl font-black text-deep-blue dark:text-white leading-tight tracking-tight">Comparateur</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg mt-2 font-medium">Comparez les prix et la fiabilité des vendeurs en Afrique.</p>
              </div>
              <button 
                  onClick={() => setIsSearchOpen(true)}
                  disabled={selectedIds.length >= maxSlots}
                  className="w-full md:w-auto px-6 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                  Ajouter ({selectedIds.length}/{maxSlots})
              </button>
          </div>

          <div className="relative bg-white dark:bg-[#111] rounded-4xl md:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 overflow-hidden">
              
              <div className="overflow-x-auto no-scrollbar scroll-smooth">
                  
                  <div className="flex w-fit min-w-full">
                      
                      {/* COLUMN 1: STICKY LABELS */}
                      <div className="sticky left-0 z-40 w-[100px] md:w-[180px] shrink-0 bg-white/95 dark:bg-[#111]/95 backdrop-blur-md border-r border-gray-100 dark:border-white/10 shadow-[10px_0_15px_-10px_rgba(0,0,0,0.05)]">
                          <div className="h-[200px] md:h-[260px] p-4 md:p-6 flex flex-col justify-end border-b border-gray-50 dark:border-white/5">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Caractéristiques</span>
                          </div>
                          
                          <div className="divide-y divide-gray-50 dark:divide-white/5">
                              <div className="h-16 md:h-20 px-4 md:px-6 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                                  <span className="text-[10px] md:text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Prix</span>
                              </div>
                              <div className="h-16 md:h-24 px-4 md:px-6 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-primary text-[18px]">store</span>
                                  <span className="text-[10px] md:text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Vendeur</span>
                              </div>
                              <div className="h-14 md:h-16 px-4 md:px-6 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-primary text-[18px]">inventory</span>
                                  <span className="text-[10px] md:text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Stock</span>
                              </div>
                              <div className="h-32 md:h-40 px-4 md:px-6 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                                  <span className="text-[10px] md:text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Action</span>
                              </div>
                          </div>
                      </div>

                      {/* PRODUCT COLUMNS */}
                      {Array.from({ length: maxSlots }).map((_, index) => {
                          const product = comparedProducts[index];
                          return (
                              <div key={index} className={`w-[150px] md:w-[240px] shrink-0 border-r border-gray-50 dark:border-white/5 flex flex-col transition-colors ${bestPriceId === product?.id ? 'bg-primary/2' : ''}`}>
                                  
                                  <div className="h-[200px] md:h-[260px] p-3 md:p-6 flex flex-col items-center text-center border-b border-gray-50 dark:border-white/5 relative">
                                      {product ? (
                                          <>
                                              <button 
                                                  onClick={() => removeProduct(product.id)}
                                                  className="absolute top-2 right-2 size-7 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 active:scale-90 transition-transform"
                                              >
                                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                              </button>
                                              <div className="size-20 md:size-32 rounded-xl bg-gray-50 dark:bg-white/5 mb-3 overflow-hidden border border-gray-100 dark:border-white/5">
                                                  <Image src={product.image} className="w-full h-full object-cover" alt={product.name} fill sizes="(max-width: 768px) 80px, 128px" />
                                              </div>
                                              <h3 className="text-[11px] md:text-sm font-black text-deep-blue dark:text-white line-clamp-2 px-1">
                                                  {product.name}
                                              </h3>
                                          </>
                                      ) : (
                                          <button 
                                              onClick={() => setIsSearchOpen(true)}
                                              className="m-auto size-16 md:size-24 rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/10 hover:border-primary flex flex-col items-center justify-center gap-1 group transition-all"
                                          >
                                              <span className="material-symbols-outlined text-gray-200 group-hover:text-primary">add</span>
                                              <span className="text-[8px] font-black text-gray-400 uppercase">Libre</span>
                                          </button>
                                      )}
                                  </div>

                                  <div className="divide-y divide-gray-50 dark:divide-white/5">
                                      <div className={`h-16 md:h-20 flex flex-col items-center justify-center text-center px-2 ${bestPriceId === product?.id ? 'bg-green-500/3' : ''}`}>
                                          {product ? (
                                              <>
                                                  <span className={`text-[15px] md:text-xl font-black ${bestPriceId === product.id ? 'text-green-600 dark:text-green-400' : 'text-deep-blue dark:text-white'}`}>
                                                      {product.price}
                                                  </span>
                                                  {bestPriceId === product.id && (
                                                      <span className="text-[7px] md:text-[9px] font-black text-green-600 uppercase tracking-tighter bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full mt-1">
                                                          Meilleur
                                                      </span>
                                                  )}
                                              </>
                                          ) : <span className="text-gray-200">—</span>}
                                      </div>

                                      <div className="h-16 md:h-24 flex flex-col items-center justify-center text-center px-3">
                                          {product ? (
                                              <>
                                                  <div className="flex items-center gap-1">
                                                      <span className="text-[10px] md:text-sm font-black text-deep-blue dark:text-white truncate">
                                                        {product.user?.boutiqueName || product.user?.fullName}
                                                      </span>
                                                      {product.user?.isVerified && <span className="material-symbols-outlined text-blue-500 text-[14px]">verified</span>}
                                                  </div>
                                                  <div className="flex items-center gap-0.5 mt-0.5">
                                                      <span className="text-[9px] font-black text-orange-500">{product.user?.trustScore}</span>
                                                      <span className="material-symbols-outlined text-[10px] text-orange-400">star</span>
                                                  </div>
                                              </>
                                          ) : <span className="text-gray-200">—</span>}
                                      </div>

                                      <div className="h-14 md:h-16 flex items-center justify-center">
                                          {product ? (
                                              <span className={`px-2 py-0.5 rounded-md text-[8px] md:text-[10px] font-black uppercase ${product.availability === 'LIMITED_STOCK' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                                                  {product.availability === 'IN_STOCK' ? 'Stock OK' : product.availability || 'Dispo'}
                                              </span>
                                          ) : <span className="text-gray-200">—</span>}
                                      </div>

                                      <div className="h-32 md:h-40 flex flex-col items-center justify-center p-3 md:p-6 gap-2 md:gap-3">
                                          {product ? (
                                              <>
                                                  <button className="w-full py-3 bg-primary text-white rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all">
                                                      Commander
                                                  </button>
                                                  <button className="w-full py-2 bg-white dark:bg-white/5 border border-green-500/30 text-green-600 rounded-xl text-[9px] md:text-[10px] font-black uppercase active:bg-green-50 transition-all">
                                                      WhatsApp
                                                  </button>
                                              </>
                                          ) : <span className="text-gray-200">—</span>}
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>

          {comparedProducts.length === 0 && (
              <div className="mt-12 flex flex-col items-center justify-center text-center p-10 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-white/5">
                  <div className="size-20 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-gray-300 mb-6 shadow-sm">
                      <span className="material-symbols-outlined text-4xl">balance</span>
                  </div>
                  <h3 className="text-xl font-black text-deep-blue dark:text-white mb-2">Comparez vos trouvailles</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-[240px] mb-8 font-medium text-xs leading-relaxed">Ajoutez des articles de différents vendeurs du continent pour trouver l&apos;offre la plus rentable.</p>
                  <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="px-8 py-4 bg-deep-blue dark:bg-white text-white dark:text-deep-blue rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl"
                  >
                      Choisir un produit
                  </button>
              </div>
          )}

          {/* SEARCH MODAL */}
          {isSearchOpen && (
              <div className="fixed inset-0 z-150 flex items-center justify-center p-0 md:p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>
                  <div className="relative w-full h-full md:h-auto md:max-w-lg bg-white dark:bg-[#1a1a1a] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 duration-300">
                      <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50 dark:border-white/5">
                          <div>
                              <h3 className="text-xl md:text-2xl font-black text-deep-blue dark:text-white">Ajouter au comparateur</h3>
                          </div>
                          <button onClick={() => setIsSearchOpen(false)} className="size-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5">
                              <span className="material-symbols-outlined">close</span>
                          </button>
                      </div>
                      
                      <div className="p-6 md:p-8">
                          <div className="relative">
                              <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">search</span>
                              <input 
                                  type="text" 
                                  placeholder="Rechercher un produit..." 
                                  autoFocus
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary/20 rounded-2xl outline-none text-[13px] font-bold dark:text-white transition-all"
                              />
                          </div>

                          <div className="mt-6 space-y-3 max-h-[60vh] md:max-h-[350px] overflow-y-auto no-scrollbar pb-6">
                              {searchResults.length > 0 ? (
                                  searchResults.map(product => (
                                      <button 
                                          key={product.id}
                                          onClick={() => addProduct(product.id)}
                                          className="w-full flex items-center gap-4 p-3 hover:bg-primary/5 rounded-2xl transition-all text-left group border border-transparent hover:border-primary/10"
                                      >
                                          <div className="size-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                              <Image src={product.image} className="w-full h-full object-cover" alt={product.name} fill sizes="48px" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <h4 className="font-black text-xs text-deep-blue dark:text-white truncate">{product.name}</h4>
                                              <div className="flex items-center justify-between mt-1">
                                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    {product.user?.boutiqueName || product.user?.fullName}
                                                  </span>
                                                  <span className="font-black text-xs text-primary">{product.displayPrice || product.price}</span>
                                              </div>
                                          </div>
                                          <span className="material-symbols-outlined text-gray-200 group-hover:text-primary">add_circle</span>
                                      </button>
                                  ))
                              ) : (
                                  <div className="text-center py-12">
                                      <span className="material-symbols-outlined text-gray-200 text-5xl">search_off</span>
                                      <p className="text-gray-400 font-bold text-xs mt-4 uppercase tracking-widest">Aucun produit trouvé</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </section>
    </main>
  );
}
