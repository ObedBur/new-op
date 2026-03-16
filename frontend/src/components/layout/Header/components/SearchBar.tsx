'use client';

import React, { useRef, useEffect } from 'react';

interface SearchBarProps {
  isSearchExpanded: boolean;
  setIsSearchExpanded: (expanded: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isSearchExpanded, setIsSearchExpanded }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  return (
    <div className={`
      ${isSearchExpanded 
        ? 'flex flex-1 items-center animate-in slide-in-from-right-4 duration-300' 
        : 'hidden md:flex flex-1 max-w-[500px] mx-4'} 
      relative group
    `}>
      {isSearchExpanded && (
        <button 
          onClick={() => setIsSearchExpanded(false)}
          className="md:hidden mr-2 p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      )}
      <div className="relative w-full">
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Rechercher un produit..."  
          className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full py-2 md:py-2.5 pl-9 md:pl-11 pr-4 text-[13px] md:text-sm focus:ring-2 focus:ring-primary/40 text-deep-blue dark:text-white placeholder-gray-500 transition-all"
        />
        <span className="material-symbols-outlined absolute left-2.5 md:left-3.5 top-1.5 md:top-2.5 text-gray-400 text-[18px] md:text-[20px] group-focus-within:text-primary transition-colors">search</span>
      </div>
    </div>
  );
};
