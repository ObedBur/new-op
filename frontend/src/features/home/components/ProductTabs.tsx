'use client';

import React, { useState } from 'react';
import { Product } from '@/features/products/types';
import { FeaturedProductStrip } from './FeaturedProductStrip';
import { useT } from '@/i18n/useT';

interface ProductTabsProps {
  deals: Product[];
  newArrivals: Product[];
  recommendations: Product[];
  bestSellers: Product[];
  onQuickView: (product: Product) => void;
  showSkeleton: boolean;
}

type TabType = 'deals' | 'newArrivals' | 'recommendations' | 'bestSellers';

export const ProductTabs: React.FC<ProductTabsProps> = ({
  deals = [],
  newArrivals = [],
  recommendations = [],
  bestSellers = [],
  onQuickView,
  showSkeleton
}) => {
  const { t } = useT();

  // Déterminer l'onglet par défaut (le premier qui a des produits)
  const defaultTab: TabType = deals.length > 0 ? 'deals' 
    : newArrivals.length > 0 ? 'newArrivals' 
    : recommendations.length > 0 ? 'recommendations' 
    : 'bestSellers';

  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const tabs = [
    { id: 'deals' as TabType, label: t('home.homeView.dealsTitle'), products: deals },
    { id: 'newArrivals' as TabType, label: t('home.homeView.newTitle'), products: newArrivals },
    { id: 'recommendations' as TabType, label: t('home.homeView.recTitle'), products: recommendations },
    { id: 'bestSellers' as TabType, label: t('home.homeView.bestTitle'), products: bestSellers },
  ].filter(tab => tab.products.length > 0);

  if (showSkeleton) {
    return (
      <div className="w-full h-64 bg-slate-100 dark:bg-white/5 animate-pulse rounded-3xl" />
    );
  }

  if (tabs.length === 0) return null;

  const activeProducts = tabs.find(tab => tab.id === activeTab)?.products || [];

  return (
    <div className="space-y-6">
      {/* Navigation des onglets */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#E67E22] text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet actif (on ne passe pas le titre pour éviter la redondance avec les onglets) */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FeaturedProductStrip
          title=""
          subtitle=""
          products={activeProducts.slice(0, 10)} // Limiter à 10 (2 rangées max)
          onQuickView={onQuickView}
        />
      </div>
    </div>
  );
};
