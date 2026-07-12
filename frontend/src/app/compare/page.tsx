'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  CheckCircle,
  Search,
  TrendingDown,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { compareProducts, CompareProduct } from '@/features/compare/compare.service';

import { CompareFilters } from './components/CompareFilters';
import { CompareStats } from './components/CompareStats';
import { CompareCharts } from './components/CompareCharts';
import { CompareProductCard } from './components/CompareProductCard';

// Carte masquée temporairement
// const CompareMap = dynamic(() => import('./components/CompareMap'), {
//   ssr: false,
//   loading: () => <div className="h-[400px] w-full rounded-3xl bg-gray-100 dark:bg-[#1a1a1a] animate-pulse mb-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
// });

// Recherches rapides variées (électronique, vêtements, alimentation, etc.)
const quickSearches = ['téléphone', 'ordinateur', 'chaussures', 'robe', 'riz', 'montre', 'savon'];

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  // Filters
  const [sortBy, setSortBy] = useState('price_asc');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyHomeDelivery, setOnlyHomeDelivery] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Tous');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const latestRequestRef = useRef(0);

  // Fetch API
  const fetchCompare = useCallback(async (q: string, signal?: AbortSignal) => {
    const normalizedQuery = q.trim();
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    if (normalizedQuery.length < 2) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await compareProducts(normalizedQuery, signal);
      if (res.success && requestId === latestRequestRef.current) {
        // Mock some data if missing from API
        const enrichedProducts = res.products.map((p, i) => ({
          ...p,
          // 20% chance of promo for testing
          hasPromo: p.hasPromo ?? Math.random() > 0.8,
          // 80% chance of open shop
          isShopOpen: p.isShopOpen ?? Math.random() > 0.2,
          // Delivery options mock
          deliveryOptions: p.deliveryOptions ?? {
            homeDelivery: Math.random() > 0.5,
            storePickup: true
          }
        }));
        setProducts(enrichedProducts);
      }
    } catch (error) {
      if (!signal?.aborted) {
        console.error('Erreur recherche comparaison:', error);
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCompare(searchQuery, controller.signal);
    return () => controller.abort();
  }, [searchQuery, fetchCompare]);

  // Debounce input
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(inputValue.trim()), 350);
    return () => clearTimeout(t);
  }, [inputValue]);

  const runQuickSearch = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
  };

  // Dynamic options based on results
  const countries = useMemo(() => {
    const cs = [...new Set(products.map(p => p.country || 'RDC').filter(Boolean))] as string[];
    return ['Tous', ...cs];
  }, [products]);

  const cities = useMemo(() => {
    const cs = [...new Set(products.map(p => p.user.city || p.city).filter(Boolean))] as string[];
    return ['Toutes', ...cs];
  }, [products]);

  // Filtrage + Tri
  const filtered = useMemo(() => {
    let result = [...products];
    
    // Country
    if (selectedCountry !== 'Tous') {
      result = result.filter(p => (p.country || 'RDC') === selectedCountry);
    }
    // City
    if (selectedCity !== 'Toutes') {
      result = result.filter(p => (p.user.city || p.city) === selectedCity);
    }
    
    // Checkboxes
    if (onlyVerified) result = result.filter(p => p.user.isVerified);
    if (onlyInStock) result = result.filter(p => p.availability === 'IN_STOCK');
    if (onlyHomeDelivery) result = result.filter(p => p.deliveryOptions?.homeDelivery);

    return result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.user.trustScore - a.user.trustScore;
      if (sortBy === 'promo') return (b.hasPromo ? 1 : 0) - (a.hasPromo ? 1 : 0);
      return 0;
    });
  }, [products, onlyVerified, selectedCity, selectedCountry, onlyInStock, onlyHomeDelivery, sortBy]);

  const filteredPrices = filtered.map(p => p.price);
  const filteredMin = filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;
  const filteredMax = filteredPrices.length > 0 ? Math.max(...filteredPrices) : 0;
  const filteredAvg = filteredPrices.length > 0
      ? (filteredPrices.reduce((a, b) => a + b, 0) / filteredPrices.length).toFixed(1)
      : '—';
  const savings = filteredPrices.length > 0 ? Number((filteredMax - filteredMin).toFixed(2)) : 0;

  const hasActiveSearch = searchQuery.trim().length >= 2;

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">

        {/* ─── EN-TÊTE ET RECHERCHE ─── */}
        <div className="text-center mb-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Comparateur Intelligent</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-deep-blue dark:text-white tracking-tighter uppercase leading-tight">
            Trouvez le <span className="text-emerald-600">Meilleur Prix</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Comparez les offres des marchands, analysez les tendances et localisez les produits au meilleur prix près de chez vous.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); setSearchQuery(inputValue.trim()); }}
            className="relative w-full max-w-2xl mx-auto mt-6 flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border-2 border-gray-100 dark:border-white/5 focus-within:border-emerald-500/50 px-6 py-4 rounded-full shadow-lg transition-all"
          >
            <Search className="text-gray-400 w-6 h-6 shrink-0" />
            <input
              type="text"
              placeholder="Ex: Riz, Tomate, Huile, Farine..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-base font-bold dark:text-white placeholder:text-gray-400"
            />
            {loading && <Loader2 className="w-5 h-5 text-emerald-500 animate-spin shrink-0" />}
          </form>

          {/* Quick searches */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {quickSearches.map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => runQuickSearch(query)}
                className="h-8 px-4 rounded-full bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 hover:text-emerald-600 transition-colors shadow-sm"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* ─── FILTRES ─── */}
        <CompareFilters 
          countries={countries}
          cities={cities}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          onlyVerified={onlyVerified}
          setOnlyVerified={setOnlyVerified}
          onlyInStock={onlyInStock}
          setOnlyInStock={setOnlyInStock}
          onlyHomeDelivery={onlyHomeDelivery}
          setOnlyHomeDelivery={setOnlyHomeDelivery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* ─── RÉSULTATS ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse">Analyse du marché en cours...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Statistiques */}
            <CompareStats 
              count={filtered.length} 
              avgPrice={filteredAvg} 
              minPrice={filteredMin} 
              maxPrice={filteredMax} 
              savings={savings} 
            />

            {/* Graphiques */}
            <CompareCharts products={filtered} />

            {/* Carte (Masquée temporairement) */}
            {/* <CompareMap products={filtered} bestPrice={filteredMin} /> */}

            {/* Grille de produits */}
            <div className="flex items-center gap-4 mb-8 text-gray-200 dark:text-white/10">
              <div className="flex-1 h-px bg-current"></div>
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 whitespace-nowrap">Meilleures Offres</span>
              <div className="flex-1 h-px bg-current"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {filtered.map((product, idx) => (
                <CompareProductCard
                  key={product.id}
                  product={product}
                  isBestPrice={product.price === filteredMin && filtered.length > 1}
                />
              ))}
            </div>
          </div>
        ) : hasActiveSearch ? (
          <div className="overflow-hidden rounded-[2.5rem] border border-[#E67E22]/20 bg-white dark:bg-[#1a1a1a] shadow-xl animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-[1.5fr_1fr]">
              <div className="p-8 sm:p-12 text-center lg:text-left flex flex-col justify-center">
                <div className="mx-auto lg:mx-0 mb-6 flex size-20 items-center justify-center rounded-[1.5rem] bg-[#E67E22]/10 text-[#E67E22] ring-1 ring-[#E67E22]/20">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-[#2D5A27] dark:text-white mb-4">
                  Aucune offre pour <br/><span className="text-[#E67E22]">&ldquo;{searchQuery}&rdquo;</span>
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto lg:mx-0">
                  Nous n'avons pas trouvé de vendeurs pour ce produit avec les filtres actuels. Essayez d'élargir votre recherche.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <button onClick={() => { setSelectedCity('Toutes'); setOnlyVerified(false); setOnlyInStock(false); }} className="h-11 px-6 rounded-xl bg-[#2D5A27] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1e3f1a] transition-all">
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>

              <div className="bg-[#2D5A27] p-8 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 size-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-6 relative z-10">
                  Conseils de recherche
                </p>
                <div className="space-y-5 relative z-10">
                  {[
                    'Utilisez des termes plus génériques (ex: "Riz" au lieu de "Riz parfumé 5kg")',
                    'Vérifiez qu\'il n\'y a pas de faute de frappe',
                    'Étendez la zone de recherche (Ville = Toutes)'
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="size-6 rounded-full bg-[#E67E22]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#E67E22]" />
                      </div>
                      <span className="text-sm font-bold text-white/90 leading-snug">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Suggestions populaires</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Téléphone', 'Chaussures', 'Ordinateur', 'Montre'].map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => runQuickSearch(query)}
                  className="group bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 hover:border-emerald-500/50 hover:shadow-xl transition-all text-center"
                >
                  <div className="size-12 mx-auto bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Search className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-lg font-black text-deep-blue dark:text-white uppercase tracking-tight">{query}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
