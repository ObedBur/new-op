import React from 'react';
import { Filter, MapPin, Search } from 'lucide-react';

interface CompareFiltersProps {
  countries: string[];
  cities: string[];
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  onlyVerified: boolean;
  setOnlyVerified: (v: boolean) => void;
  onlyInStock: boolean;
  setOnlyInStock: (v: boolean) => void;
  onlyHomeDelivery: boolean;
  setOnlyHomeDelivery: (v: boolean) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}

export const CompareFilters: React.FC<CompareFiltersProps> = ({
  countries,
  cities,
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  onlyVerified,
  setOnlyVerified,
  onlyInStock,
  setOnlyInStock,
  onlyHomeDelivery,
  setOnlyHomeDelivery,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-[2rem] p-5 lg:p-6 shadow-sm flex flex-col gap-5 lg:flex-row lg:items-end justify-between w-full mb-8">
      
      {/* Zone Géographique */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#E67E22]" /> Pays
          </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/50 rounded-xl h-11 px-4 text-sm font-bold text-deep-blue dark:text-white outline-none transition-all appearance-none cursor-pointer"
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-emerald-500" /> Ville
          </label>
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-emerald-500/50 rounded-xl h-11 px-4 text-sm font-bold text-deep-blue dark:text-white outline-none transition-all appearance-none cursor-pointer"
          >
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
        <button
          onClick={() => setOnlyVerified(!onlyVerified)}
          className={`h-9 px-4 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${onlyVerified
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
            }`}
        >
          Vendeurs Vérifiés
        </button>
        <button
          onClick={() => setOnlyInStock(!onlyInStock)}
          className={`h-9 px-4 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${onlyInStock
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
            }`}
        >
          En Stock
        </button>
        <button
          onClick={() => setOnlyHomeDelivery(!onlyHomeDelivery)}
          className={`h-9 px-4 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${onlyHomeDelivery
            ? 'bg-[#E67E22] border-[#E67E22] text-white'
            : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
            }`}
        >
          Livraison Domicile
        </button>
      </div>

      {/* Tri */}
      <div className="shrink-0 w-full sm:w-auto pt-2 lg:pt-0">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-1.5 lg:hidden">
          <Filter className="w-3 h-3 text-[#2D5A27]" /> Trier par
        </label>
        <div className="h-11 flex items-center justify-center gap-2 bg-[#2D5A27]/5 dark:bg-white/5 px-4 rounded-xl border border-[#2D5A27]/10 dark:border-white/10 min-w-0 w-full lg:w-auto">
          <span className="material-symbols-outlined text-[14px] text-[#2D5A27] dark:text-white shrink-0">sort</span>
          <select
            className="min-w-0 w-full bg-transparent text-[11px] font-black uppercase tracking-widest text-[#2D5A27] dark:text-white outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Trier les offres"
          >
            <option value="price_asc">Prix le plus bas</option>
            <option value="price_desc">Prix le plus élevé</option>
            <option value="rating">Meilleure note</option>
            <option value="promo">Promotions</option>
          </select>
        </div>
      </div>
    </div>
  );
};
