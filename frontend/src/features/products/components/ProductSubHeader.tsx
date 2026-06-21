import React, { useState } from 'react';
import { Category } from '../types';

interface ProductSubHeaderProps {
  categories: Category[];
}

export const ProductSubHeader: React.FC<ProductSubHeaderProps> = ({ categories }) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <div className="w-full border-y border-gray-200 bg-white mb-6">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap hide-scrollbar text-[13px] text-gray-600 font-medium relative">
          
          {/* Categories Dropdown */}
          <div 
            className="flex items-center gap-2 py-4 border-r border-gray-100 pr-6 cursor-pointer hover:text-[#E67E22] transition-colors relative"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
            <span>Catégories</span>
            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
            
            {/* Dropdown Menu */}
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-b-xl py-2 z-50 flex flex-col">
                {categories.map(cat => (
                  <div key={cat.id} className="px-4 py-2 hover:bg-gray-50 hover:text-[#E67E22] flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-[18px] opacity-70">{cat.icon || 'category'}</span>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 py-4 cursor-pointer hover:text-[#E67E22] transition-colors">
            Centre d'Achat <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </div>
          
          <div className="flex items-center gap-1 py-4 cursor-pointer hover:text-[#E67E22] transition-colors">
            Prêt à expédier
          </div>
          
          <div className="flex items-center gap-1 py-4 cursor-pointer hover:text-[#E67E22] transition-colors">
            Vendre sur WapiBei <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </div>
          
          <div className="flex items-center gap-1 py-4 cursor-pointer hover:text-[#E67E22] transition-colors">
            Aide <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </div>
          
          <div className="flex items-center gap-1 py-4 cursor-pointer hover:text-[#E67E22] transition-colors">
            Protection Personnelle
          </div>

        </div>
      </div>
    </div>
  );
};
