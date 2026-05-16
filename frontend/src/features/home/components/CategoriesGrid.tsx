"use client";

import React from 'react';
import Link from 'next/link';
import { Category } from '@/features/products/types';

export const CategoriesGrid: React.FC<{ categories: Category[], isLoading?: boolean }> = ({ categories, isLoading }) => {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'popular'>('all');

  // Filtrage des catégories (Simulé pour 'popular' en prenant les premières avec count > 0)
  const displayedCategories = React.useMemo(() => {
    if (activeFilter === 'all') return categories;
    return categories
      .filter(c => (c.productCount || 0) > 0)
      .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
      .slice(0, 4);
  }, [categories, activeFilter]);

  if (isLoading) {
    return <div className="text-center py-10 text-slate-500 animate-pulse">Chargement des secteurs...</div>;
  }

  if (!categories || categories.length === 0) {
    return null; // On cache complètement la section si elle est vide
  }

  return (
    <section className="py-8 px-4 bg-[#F8F9FA]">
      <div className="container mx-auto max-w-7xl">

        {/* HEADER : Titre et Filtres avec un look plus "App" sur mobile */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Explorer par <span className="text-[#E67E22]">Secteur</span>
            </h2>
            <p className="text-slate-500 text-[10px] md:text-sm font-medium">Trouvez les meilleures offres par catégorie d'articles</p>
          </div>

          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 w-full max-w-[280px] md:w-auto h-fit shadow-inner">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Tous les Secteurs
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeFilter === 'popular'
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Populaires
            </button>
          </div>
        </div>

        {/* GRILLE DYNAMIQUE : Scroll horizontal sur mobile/tablette, Grille sur Desktop */}
        <div className="flex lg:grid lg:grid-cols-4 flex-nowrap lg:flex-wrap overflow-x-auto lg:overflow-x-visible pb-6 lg:pb-0 gap-3 scrollbar-hide snap-x snap-mandatory">
          {displayedCategories.map((cat) => {
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group min-w-[190px] sm:min-w-[220px] lg:min-w-0 bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 snap-start"
              >
                {/* Texte à droite, compact */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate leading-none mb-1.5">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                      {cat.productCount || 0} Art.
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};