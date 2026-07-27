'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  Loader2,
  TrendingUp,
  Search,
  Scale,
  X,
  Store,
  ArrowRight,
  CheckCircle,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { compareProducts, CompareProduct } from '@/features/compare/compare.service';
import { getBestSellers } from '@/features/products/services/product.service';
import { Product } from '@/features/products/types';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductQuickView } from '@/features/products/components/ProductQuickView';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/features/cart/context/CartContext';


// ─────────────────────────────────────────────
// EMPTY STATE (ACCUEIL COMPARATEUR)
// ─────────────────────────────────────────────
function EmptyCompareState() {
  const [trends, setTrends] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrends() {
      try {
        const res = await getBestSellers(6);
        if (res.success && res.data) {
          setTrends(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTrends();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-100 dark:border-white/5 p-8 md:p-12 lg:p-16 text-center relative overflow-hidden mb-8 shadow-sm">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D5A27 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3">
            <Scale className="w-10 h-10 text-[#2D5A27] dark:text-emerald-400 -rotate-3" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2D5A27] dark:text-white tracking-tight mb-4 uppercase">
            Le Marché <span className="text-[#E67E22]">Transparent</span>
          </h1>
          <p className="text-sm md:text-base font-bold text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Trouvez toujours le meilleur prix. Utilisez la barre de recherche ci-dessus pour comparer les offres parmi nos vendeurs vérifiés.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center mb-4 text-[#2D5A27]">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400 mb-2">1. Recherchez</h3>
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed">Saisissez un produit dans la barre de recherche du menu.</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform delay-75">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-4 text-[#2D5A27] dark:text-emerald-400">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400 mb-2">2. Comparez</h3>
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed">Filtrez par prix, localisation et vendeurs vérifiés.</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform delay-150">
          <div className="w-12 h-12 bg-orange-50 dark:bg-[#E67E22]/10 rounded-xl flex items-center justify-center mb-4 text-[#E67E22]">
            <svg className="shrink-0 text-[#25D366] fill-current" width="20" height="20" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400 mb-2">3. Commandez</h3>
          <p className="text-[10px] font-bold text-gray-500 leading-relaxed">Contactez directement le vendeur via WhatsApp en 1 clic.</p>
        </div>
      </div>

      {/* Trending / Best Sellers */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-[#E67E22]" />
          <h3 className="text-sm font-black uppercase tracking-widest text-[#2D5A27] dark:text-white">Comparaisons Tendances</h3>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : trends.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {trends.map(product => (
              <Link 
                key={product.id}
                href={`/compare?q=${encodeURIComponent(product.name)}`}
                className="group bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-[#E67E22] hover:shadow-lg transition-all"
              >
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 group-hover:text-[#2D5A27] dark:group-hover:text-emerald-400 transition-colors">
                  {product.name}
                </p>
                <div className="flex justify-end">
                  <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#E67E22] group-hover:text-white text-gray-400 transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs font-bold text-gray-400">Aucune tendance disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────
function CompareContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const latestRequestRef = useRef(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtres & Tri
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [availability, setAvailability] = useState<'ALL' | 'IN_STOCK'>('ALL');
  const [sortBy, setSortBy] = useState('price_asc');

  // 1. Fetch Data
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
        setProducts(res.products);
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
    fetchCompare(query, controller.signal);
    return () => controller.abort();
  }, [query, fetchCompare]);

  // 2. Extraire les options de filtres depuis les données
  const availableCities = useMemo(() => {
    const cities = products.map(p => p.user.city || p.city).filter(Boolean) as string[];
    return [...new Set(cities)];
  }, [products]);

  const availableShops = useMemo(() => {
    const shops = products.map(p => p.user.boutiqueName || p.user.fullName).filter(Boolean);
    return [...new Set(shops)];
  }, [products]);

  // 3. Convert CompareProduct to Product type
  const convertToProduct = (cp: CompareProduct): Product => ({
    id: cp.id,
    name: cp.name,
    description: cp.description || '',
    location: cp.location || '',
    city: cp.city,
    country: cp.country,
    price: cp.price,
    displayPrice: cp.displayPrice || undefined,
    categoryId: String(cp.category?.id) || '',
    image: cp.images?.[0] || cp.image || '/images/placeholder.png',
    images: cp.images,
    updatedAt: new Date().toISOString(),
    availability: cp.availability as 'IN_STOCK' | 'LIMITED_STOCK' | 'OUT_OF_STOCK',
    stockQuantity: undefined,
    unit: undefined,
    user: {
      id: cp.user.id,
      fullName: cp.user.fullName,
      boutiqueName: cp.user.boutiqueName || undefined,
      isVerified: cp.user.isVerified,
      trustScore: cp.user.trustScore,
      phone: cp.user.phone,
      avatarUrl: cp.user.avatarUrl || undefined,
    },
  });

  // 4. Appliquer Filtres et Tri
  const filteredAndConverted = useMemo(() => {
    let result = [...products];

    if (isVerifiedOnly) {
      result = result.filter(p => p.user.isVerified);
    }

    if (availability === 'IN_STOCK') {
      result = result.filter(p => p.availability === 'IN_STOCK' || p.availability === 'LIMITED_STOCK');
    }
    
    if (minPrice) {
      result = result.filter(p => p.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      result = result.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (selectedCities.length > 0) {
      result = result.filter(p => selectedCities.includes(p.user.city || p.city));
    }
    
    if (selectedShops.length > 0) {
      result = result.filter(p => selectedShops.includes(p.user.boutiqueName || p.user.fullName));
    }

    const sorted = result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.user.trustScore - a.user.trustScore;
      return 0;
    });

    return sorted.map(convertToProduct);
  }, [products, isVerifiedOnly, minPrice, maxPrice, selectedCities, selectedShops, sortBy, availability]);

  const filteredPrices = filteredAndConverted.map((p) => p.price);
  const filteredMin = filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;

  // Toggle helpers
  const toggleCity = (city: string) => {
    setSelectedCities(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  };
  
  const toggleShop = (shop: string) => {
    setSelectedShops(prev => prev.includes(shop) ? prev.filter(s => s !== shop) : [...prev, shop]);
  };

  const clearFilters = () => {
    setIsVerifiedOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSelectedCities([]);
    setSelectedShops([]);
    setAvailability('ALL');
  };

  // Composant: Contenu des filtres (utilisé en desktop et mobile)
  const FilterOptions = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400">Filtres</h3>
        <button onClick={clearFilters} className="text-[10px] font-bold text-gray-400 hover:text-[#E67E22] transition-colors">
          Effacer tout
        </button>
      </div>

      {/* Confiance - Toggle Switch */}
      <div 
        className="flex items-center justify-between group cursor-pointer" 
        onClick={() => setIsVerifiedOnly(!isVerifiedOnly)}
      >
        <div>
          <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Vendeurs Vérifiés</h4>
          <p className="text-[9px] font-medium text-gray-400">Afficher uniquement les pros</p>
        </div>
        <div className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${isVerifiedOnly ? 'bg-[#E67E22]' : 'bg-gray-200 dark:bg-white/10'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isVerifiedOnly ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </div>

      {/* Disponibilité */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Disponibilité</h4>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setAvailability('ALL')}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${availability === 'ALL' ? 'border-[#E67E22]' : 'border-gray-300 dark:border-white/20'}`}>
              {availability === 'ALL' && <div className="w-2 h-2 rounded-full bg-[#E67E22]" />}
            </div>
            <span className={`text-xs font-bold transition-colors ${availability === 'ALL' ? 'text-gray-900 dark:text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>Tous les articles</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setAvailability('IN_STOCK')}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${availability === 'IN_STOCK' ? 'border-[#E67E22]' : 'border-gray-300 dark:border-white/20'}`}>
              {availability === 'IN_STOCK' && <div className="w-2 h-2 rounded-full bg-[#E67E22]" />}
            </div>
            <span className={`text-xs font-bold transition-colors ${availability === 'IN_STOCK' ? 'text-gray-900 dark:text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>En stock uniquement</span>
          </label>
        </div>
      </div>

      {/* Fourchette de prix */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Prix ($)</h4>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black">$</span>
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={(e) => setMinPrice(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setMinPrice(e.currentTarget.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl pl-7 pr-3 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/20 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="w-2 h-px bg-gray-300 dark:bg-white/10 shrink-0" />
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black">$</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={(e) => setMaxPrice(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setMaxPrice(e.currentTarget.value)}
              className="w-full bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl pl-7 pr-3 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Localisation */}
      {availableCities.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Villes</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 no-scrollbar">
            {availableCities.map(city => (
              <label key={city} className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative flex items-center justify-center w-4 h-4 rounded border ${selectedCities.includes(city) ? 'bg-[#E67E22] border-[#E67E22]' : 'border-gray-300 dark:border-white/20 group-hover:border-[#E67E22]'} transition-colors`}>
                  {selectedCities.includes(city) && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 select-none truncate">{city}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Boutiques */}
      {availableShops.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Boutiques</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
            {availableShops.map(shop => (
              <label key={shop} className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative flex items-center justify-center w-4 h-4 rounded border ${selectedShops.includes(shop) ? 'bg-[#E67E22] border-[#E67E22]' : 'border-gray-300 dark:border-white/20 group-hover:border-[#E67E22]'} transition-colors`}>
                  {selectedShops.includes(shop) && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 select-none truncate">{shop}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-black pt-20 sm:pt-24 pb-20 sm:pb-24">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* En-tête de page simple */}
        {query.trim().length >= 2 && !loading && (
          <div className="mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2D5A27] dark:text-white uppercase tracking-tight">
                Comparaison: <span className="text-[#E67E22]">&ldquo;{query}&rdquo;</span>
              </h1>
              <p className="text-xs font-bold text-gray-400 mt-1">
                {filteredAndConverted.length} offre{filteredAndConverted.length !== 1 ? 's' : ''} trouvée{filteredAndConverted.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* LAYOUT PRINCIPAL */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
          
          {/* SIDEBAR DESKTOP */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] shadow-sm">
            <FilterOptions />
          </aside>

          {/* ZONE PRINCIPALE (Tri + Grille) */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Barre de Tri (Desktop) */}
            {filteredAndConverted.length > 0 && !loading && (
              <div className="hidden lg:flex items-center justify-between bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-3 shadow-sm mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {filteredAndConverted.length} Résultat{filteredAndConverted.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trier par:</span>
                  <select
                    className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400 rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-[#E67E22]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="rating">Mieux notés</option>
                  </select>
                </div>
              </div>
            )}

            {/* GRILLE PRODUITS */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Analyse du marché en cours...</p>
              </div>
            ) : filteredAndConverted.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6">
                {filteredAndConverted.map((product, idx) => (
                  <div key={product.id} className="relative animate-in fade-in slide-in-from-bottom-6 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                    {product.price === filteredMin && filteredAndConverted.length > 1 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-emerald-600 text-[8px] font-black uppercase tracking-widest text-white rounded-full shadow-lg whitespace-nowrap">
                        Meilleur Prix
                      </div>
                    )}
                    <ProductCard product={product} onQuickView={setSelectedProduct} />
                  </div>
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="py-20 text-center bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-gray-300 dark:text-white/20" />
                </div>
                <h2 className="text-xl font-black text-gray-400 dark:text-white/40 uppercase tracking-tight">
                  Aucun produit trouvé pour &ldquo;{query}&rdquo;
                </h2>
                <p className="text-xs font-bold text-gray-400 mt-2">Vérifiez l'orthographe ou ajustez vos filtres.</p>
                {products.length > 0 && (
                  <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-[#E67E22] hover:bg-[#d67118] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                    Effacer les filtres
                  </button>
                )}
              </div>
            ) : (
              <EmptyCompareState />
            )}

          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductQuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] dark:bg-black" />}>
      <CompareContent />
    </Suspense>
  );
}
