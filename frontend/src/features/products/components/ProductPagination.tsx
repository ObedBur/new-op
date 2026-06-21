'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1.5 mt-12">
        <Button 
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="size-9 rounded-xl border border-gray-100 dark:border-white/10 text-[#2D5A27] dark:text-white"
        >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </Button>
        
        <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button 
                    key={page}
                    variant="ghost"
                    size="icon"
                    onClick={() => onPageChange(page)}
                    className={`size-9 rounded-xl text-[10px] font-black ${
                        currentPage === page 
                        ? 'bg-[#E67E22] hover:bg-[#d6721b] text-white shadow-lg shadow-[#E67E22]/20' 
                        : 'bg-white dark:bg-white/5 text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                >
                    {page}
                </Button>
            ))}
        </div>

        <Button 
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="size-9 rounded-xl border border-gray-100 dark:border-white/10 text-[#2D5A27] dark:text-white"
        >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </Button>
    </div>
  );
};
