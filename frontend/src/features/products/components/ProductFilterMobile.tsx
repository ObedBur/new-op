'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Category, ProductFilters } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  filters: ProductFilters;
  onUpdate: (updates: Partial<ProductFilters>) => void;
}

export const ProductFilterMobile: React.FC<MobileDrawerProps> = ({ isOpen, onClose, categories, filters, onUpdate }) => {
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice || '');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[150] flex justify-end lg:hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-[85vw] max-w-[340px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-[19px] font-extrabold text-slate-800">Filtres</h2>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose} 
                    className="bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500 h-9 w-9"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {/* Types de Fournisseurs */}
                <div className="mb-8">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-4">Types de Fournisseurs</h3>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={filters.vendorAssurance || false}
                                onChange={() => handleCheckboxChange('vendorAssurance')}
                                className="size-[20px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                            />
                            <span className="material-symbols-outlined text-[#E67E22] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                            <span className="text-[15px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Assurance Commerce</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={filters.vendorVerified || false}
                                onChange={() => handleCheckboxChange('vendorVerified')}
                                className="size-[20px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                            />
                            <span className="material-symbols-outlined text-[#1877F2] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <span className="text-[15px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Fournisseurs Vérifiés</span>
                        </label>
                    </div>
                </div>

                {/* Types de Produits */}
                <div className="mb-8">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-4">Types de Produits</h3>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={filters.productReadyToShip || false}
                                onChange={() => handleCheckboxChange('productReadyToShip')}
                                className="size-[20px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                            />
                            <span className="text-[15px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Prêt à Expédier</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={filters.productSamples || false}
                                onChange={() => handleCheckboxChange('productSamples')}
                                className="size-[20px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                            />
                            <span className="text-[15px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Échantillons Payants</span>
                        </label>
                    </div>
                </div>

                {/* Condition */}
                <div className="mb-9">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-4">Condition</h3>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={filters.conditionNew || false}
                                onChange={() => handleCheckboxChange('conditionNew')}
                                className="size-[20px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                            />
                            <span className="text-[15px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Nouveautés</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={filters.conditionUsed || false}
                                onChange={() => handleCheckboxChange('conditionUsed')}
                                className="size-[20px] rounded-[4px] border-slate-300 text-[#E67E22] focus:ring-[#E67E22] accent-[#E67E22] transition-colors" 
                            />
                            <span className="text-[15px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Occasion</span>
                        </label>
                    </div>
                </div>

                {/* Commande Min */}
                <div className="mb-9">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-9">Commande Min</h3>
                    <div className="relative pt-2 pb-2">
                        <div 
                          className="absolute top-[-14px] transform -translate-x-1/2 flex flex-col items-center pointer-events-none" 
                          style={{ left: `${percentage}%` }}
                        >
                            <div className="bg-[#E67E22] text-white text-[12px] font-bold px-2 py-0.5 rounded-[4px]">
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
                            aria-label="Commande minimum"
                            className="w-full h-[6px] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#E67E22] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#E67E22] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                            style={{
                                background: `linear-gradient(to right, #E67E22 0%, #E67E22 ${percentage}%, #f1f5f9 ${percentage}%, #f1f5f9 100%)`
                            }}
                        />
                    </div>
                </div>

                {/* Prix */}
                <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-4">Prix</h3>
                    <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#E67E22] focus-within:ring-1 focus-within:ring-[#E67E22] transition-shadow bg-slate-50">
                        <div className="pl-4 pr-3 py-3 flex items-center justify-center">
                            <span className="text-slate-500 font-bold text-[15px]">$</span>
                        </div>
                        <input 
                            type="number" 
                            placeholder="100"
                            value={filters.maxPrice || ''}
                            onChange={(e) => onUpdate({ maxPrice: e.target.value })}
                            aria-label="Prix maximum"
                            className="flex-1 w-full pr-4 py-3 text-[15px] outline-none text-slate-700 bg-white border-l border-slate-200"
                            min="0"
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
                <Button 
                    onClick={onClose}
                    className="w-full py-6 text-[14px] uppercase tracking-widest bg-[#E67E22] hover:bg-[#d6721b] text-white rounded-xl font-black shadow-lg shadow-[#E67E22]/20 transition-transform active:scale-95"
                >
                    Appliquer les filtres
                </Button>
            </div>
        </div>
    </div>
  );
};
