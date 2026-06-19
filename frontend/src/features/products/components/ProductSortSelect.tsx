'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface SortSelectProps {
  count: number;
  onOpenMobileFilters: () => void;
}

export const ProductSortSelect: React.FC<SortSelectProps> = ({ count, onOpenMobileFilters }) => {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
            <Button 
                variant="outline"
                size="sm"
                onClick={onOpenMobileFilters}
                className="md:hidden h-9 px-4 border-gray-200 dark:border-white/10 text-[#2D5A27] dark:text-white"
                leftIcon={<span className="material-symbols-outlined text-[16px]">tune</span>}
            >
                Filtrer
            </Button>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="text-[#2D5A27] dark:text-white">{count}</span> articles
            </p>
        </div>
    </div>
  );
};
