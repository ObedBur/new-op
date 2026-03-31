'use client';

import React from 'react';
import { SortOption, CurrencyType } from '../types';
import { Button } from '@/components/ui/Button';
import { CurrencySelector } from './CurrencySelector';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  count: number;
  onOpenMobileFilters: () => void;
  currency?: CurrencyType;
  onCurrencyChange?: (currency: CurrencyType) => void;
}

export const ProductSortSelect: React.FC<SortSelectProps> = ({ value, onChange, count, onOpenMobileFilters, currency = 'USD', onCurrencyChange }) => {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
            <Button 
                variant="outline"
                size="sm"
                onClick={onOpenMobileFilters}
                className="lg:hidden h-9 px-4 border-gray-200 dark:border-white/10 text-[#2D5A27] dark:text-white"
                leftIcon={<span className="material-symbols-outlined text-[16px]">tune</span>}
            >
                Filtrer
            </Button>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="text-[#2D5A27] dark:text-white">{count}</span> articles
            </p>
        </div>

        <div className="flex items-center gap-3">
            {onCurrencyChange && <CurrencySelector value={currency} onChange={onCurrencyChange} />}
            
            <div className="bg-white dark:bg-white/10 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/20 flex items-center">
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value as SortOption)}
                    className="bg-transparent border-none text-[10px] font-black text-[#2D5A27] dark:text-white focus:ring-0 cursor-pointer py-0.5 pr-6 uppercase tracking-widest"
                >
                    <option value="relevance">Top</option>
                    <option value="price_asc">Prix ↓</option>
                    <option value="price_desc">Prix ↑</option>
                    <option value="newest">Récents</option>
                </select>
            </div>
        </div>
    </div>
  );
};
