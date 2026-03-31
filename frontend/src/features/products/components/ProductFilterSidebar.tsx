'use client';

import React, { useState } from 'react';
import { Category, ProductFilters } from '../types';

interface SidebarProps {
  categories: Category[];
  filters: ProductFilters;
  onUpdate: (updates: Partial<ProductFilters>) => void;
}

export const ProductFilterSidebar: React.FC<SidebarProps> = ({ _categories, filters, onUpdate }) => {
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice || '');

  const handlePriceChange = (value: string) => {
    setMinPrice(value);
    onUpdate({ minPrice: value });
  };

  const handleCheckboxChange = (key: keyof ProductFilters) => {
    onUpdate({ 
      [key]: !(filters[key] as boolean)
    });
  };

  // Calculate percentage for slider background and tooltip position
  const percentage = (parseFloat(minPrice) / 1000) * 100 || 0;

  return (
    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24 self-start">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-[17px] font-extrabold text-slate-800 mb-6">Filtres</h2>

            {/* Types de Fournisseurs */}
            <div className="mb-7">
                <h3 className="text-[15px] font-bold text-slate-800 mb-4">Types de Fournisseurs</h3>
                <div className="space-y-3.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={filters.vendorAssurance || false}
                            onChange={() => handleCheckboxChange('vendorAssurance')}
                            className="size-[18px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                        />
                        <span className="material-symbols-outlined text-[#E67E22] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                        <span className="text-[14px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Assurance Commerce</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={filters.vendorVerified || false}
                            onChange={() => handleCheckboxChange('vendorVerified')}
                            className="size-[18px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                        />
                        <span className="material-symbols-outlined text-[#1877F2] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="text-[14px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Fournisseurs Vérifiés</span>
                    </label>
                </div>
            </div>

            {/* Types de Produits */}
            <div className="mb-7">
                <h3 className="text-[15px] font-bold text-slate-800 mb-4">Types de Produits</h3>
                <div className="space-y-3.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={filters.productReadyToShip || false}
                            onChange={() => handleCheckboxChange('productReadyToShip')}
                            className="size-[18px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                        />
                        <span className="text-[14px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Prêt à Expédier</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={filters.productSamples || false}
                            onChange={() => handleCheckboxChange('productSamples')}
                            className="size-[18px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                        />
                        <span className="text-[14px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Échantillons Payants</span>
                    </label>
                </div>
            </div>

            {/* Condition */}
            <div className="mb-8">
                <h3 className="text-[15px] font-bold text-slate-800 mb-4">Condition</h3>
                <div className="space-y-3.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={filters.conditionNew || false}
                            onChange={() => handleCheckboxChange('conditionNew')}
                            className="size-[18px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                        />
                        <span className="text-[14px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Nouveautés</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={filters.conditionUsed || false}
                            onChange={() => handleCheckboxChange('conditionUsed')}
                            className="size-[18px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                        />
                        <span className="text-[14px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Occasion</span>
                    </label>
                </div>
            </div>

            {/* Commande Min */}
            <div className="mb-8">
                <h3 className="text-[15px] font-bold text-slate-800 mb-8">Commande Min</h3>
                <div className="relative pt-2 pb-2">
                    <div 
                      className="absolute top-[-14px] transform -translate-x-1/2 flex flex-col items-center pointer-events-none" 
                      style={{ left: `${percentage}%` }}
                    >
                        <div className="bg-[#E67E22] text-white text-[11px] font-bold px-2 py-0.5 rounded-[4px]">
                            {minPrice} $
                        </div>
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#E67E22]"></div>
                    </div>
                    
                    <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        value={minPrice || 0}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full h-[6px] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#E67E22] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#E67E22] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                        style={{
                            background: `linear-gradient(to right, #E67E22 0%, #E67E22 ${percentage}%, #f1f5f9 ${percentage}%, #f1f5f9 100%)`
                        }}
                    />
                </div>
            </div>

            {/* Prix */}
            <div>
                <h3 className="text-[15px] font-bold text-slate-800 mb-4">Prix</h3>
                <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#E67E22] focus-within:ring-1 focus-within:ring-[#E67E22] transition-shadow bg-slate-50">
                    <div className="pl-4 pr-3 py-2.5 flex items-center justify-center">
                        <span className="text-slate-500 font-bold text-[15px]">$</span>
                    </div>
                    <input 
                        type="number" 
                        placeholder="100" 
                        value={filters.maxPrice || ''}
                        onChange={(e) => onUpdate({ maxPrice: e.target.value })}
                        aria-label="Prix maximum"
                        className="flex-1 w-full pr-4 py-2.5 text-sm outline-none text-slate-700 bg-white border-l border-slate-200"
                        min="0"
                    />
                </div>
            </div>
        </div>
    </aside>
  );
};
