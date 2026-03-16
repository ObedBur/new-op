"use client";

import React from 'react';
import Link from 'next/link';
import { Category } from '@/features/products/types';

export const CategoriesGrid: React.FC<{ categories: Category[] }> = ({ categories }) => {

  // Fonction de secours pour les styles
  const getCategoryStyle = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('agro')) return { icon: 'agriculture', color: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600' };
    if (n.includes('tech')) return { icon: 'devices', color: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600' };
    if (n.includes('mode')) return { icon: 'apparel', color: 'bg-pink-600', light: 'bg-pink-50', text: 'text-pink-600' };
    return { icon: 'category', color: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' };
  };

  // Si pas de catégories, on affiche un petit message pour déboguer
  if (!categories || categories.length === 0) {
    return <div className="text-center py-10">Chargement des rayons...</div>;
  }

  return (
    <section className="py-12 px-4 bg-[#F8F9FA]">
      <div className="container mx-auto max-w-7xl">

        {/* Header (Ce qu'on voit sur ton image) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Explorer par <span className="text-[#2D5A27]">Secteur</span>
            </h2>
            <p className="text-slate-500 text-sm">Trouvez les meilleures offres des boutiques africaines.</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm h-fit">
            <button className="px-5 py-1.5 bg-[#2D5A27] text-white rounded-lg text-xs font-bold">Tous</button>
            <button className="px-5 py-1.5 text-slate-500 text-xs font-semibold">Populaires</button>
          </div>
        </div>

        {/* GRILLE CORRIGÉE : Plus simple pour assurer l'affichage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const style = getCategoryStyle(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div className={`size-14 rounded-xl ${style.light} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined text-3xl ${style.text}`}>
                      {style.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    {cat.productCount || 0} Articles
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-0.5">{cat.name}</h3>
                  <p className="text-slate-400 text-xs italic">Découvrir la sélection WapiBei</p>
                </div>

                <div className="flex items-center text-[#E67E22] font-bold text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Voir les produits <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};