'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle,
  Phone,
  ShoppingCart,
  Star,
  Search,
  TrendingDown,
  ShieldCheck,
  MapPin,
  Package,
  Filter,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { compareProducts, CompareProduct } from '@/features/compare/compare.service';

const quickSearches = ['riz', 'tomate', 'huile', 'farine', 'sucre'];

// ─────────────────────────────────────────────
// SELLER CARD
// ─────────────────────────────────────────────
const SellerCard: React.FC<{ product: CompareProduct; isBestPrice: boolean }> = ({
  product,
  isBestPrice,
}) => {
  const shopName = product.user.boutiqueName || product.user.fullName;
  const rating = Math.min(5, Math.max(1, Math.round(product.user.trustScore / 20)));
  const city = product.user.city || product.city || product.user.province;
  const waMsg = encodeURIComponent(
    `Bonjour ${shopName}, je souhaite commander "${product.name}" vu sur WapiBei.`
  );
  const waLink = `https://wa.me/${product.user.phone.replace(/[^0-9]/g, '')}?text=${waMsg}`;

  return (
    <div
      className={`relative bg-white dark:bg-[#1a1a1a] border ${isBestPrice
        ? 'border-emerald-500 shadow-xl sm:shadow-2xl sm:scale-[1.02] z-10'
        : 'border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1'
        } rounded-2xl sm:rounded-[2rem] p-4 flex flex-col transition-all duration-500 group`}
    >
      {isBestPrice && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-[8px] font-black uppercase tracking-widest text-white rounded-full shadow-lg z-20 whitespace-nowrap">
          Meilleur Prix
        </div>
      )}

      {/* Header: Avatar + Nom */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative shrink-0">
          <div className="size-12 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5">
            <Image
              src={
                product.user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(shopName)}&background=random&size=100`
              }
              alt={shopName}
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          {product.user.isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-[#1a1a1a] rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" fill="currentColor" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-black text-deep-blue dark:text-white truncate uppercase tracking-tight leading-tight">
            {shopName}
          </h4>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[9px] font-black text-gray-400">
              {rating}.0 / 5
            </span>
          </div>
        </div>
      </div>

      {/* Nom du produit */}
      <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
        {product.name}
      </p>

      {/* Stats */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span className="truncate">{city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500">
          <Package className="w-3 h-3" />
          <span>{product.availability === 'IN_STOCK' ? 'En stock' : product.availability === 'LIMITED_STOCK' ? 'Stock limité' : 'Rupture'}</span>
        </div>
      </div>

      {/* Prix */}
      <div
        className={`mb-4 p-3 rounded-2xl text-center ${isBestPrice
          ? 'bg-emerald-50 dark:bg-emerald-500/5'
          : 'bg-gray-50 dark:bg-white/5'
          }`}
      >
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
          Prix
        </p>
        <span
          className={`text-xl sm:text-2xl font-black tracking-tighter break-words ${isBestPrice
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-deep-blue dark:text-white'
            }`}
        >
          {product.displayPrice || `${product.price} $`}
        </span>
      </div>

      {/* Boutons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <Link href={waLink} target="_blank" className="block">
          <Button
            variant="outline"
            className="w-full h-9 text-[9px] font-black uppercase tracking-widest rounded-xl border-gray-100 dark:border-white/5 px-1"
          >
            <Phone className="w-3 h-3 mr-1.5 text-emerald-600 shrink-0" /> <span className="truncate">WhatsApp</span>
          </Button>
        </Link>
        <Link href={`/products/${product.id}`} className="block">
          <Button className="w-full h-9 bg-[#2D5A27] hover:bg-[#1e3f1a] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-95 px-1">
            <ShoppingCart className="w-3 h-3 mr-1.5 shrink-0" /> <span className="truncate">Voir</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────
export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const latestRequestRef = useRef(0);

  // Fetch depuis l'API Backend
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

  // Villes dynamiques basées sur la data
  const cities = useMemo(() => {
    const cs = [...new Set(products.map((p) => p.user.city || p.city).filter(Boolean))] as string[];
    return ['Toutes', ...cs];
  }, [products]);

  // Filtrage + Tri
  const filtered = useMemo(() => {
    let result = [...products];
    if (onlyVerified) result = result.filter((p) => p.user.isVerified);
    if (selectedCity !== 'Toutes') {
      result = result.filter(
        (p) => (p.user.city || p.city) === selectedCity
      );
    }
    return result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.user.trustScore - a.user.trustScore;
      return 0;
    });
  }, [products, onlyVerified, selectedCity, sortBy]);

  const filteredPrices = filtered.map((p) => p.price);
  const filteredMin = filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;
  const filteredMax = filteredPrices.length > 0 ? Math.max(...filteredPrices) : 0;
  const filteredAvg =
    filteredPrices.length > 0
      ? (filteredPrices.reduce((a, b) => a + b, 0) / filteredPrices.length).toFixed(1)
      : '—';

  const featured = filtered[0] ?? null;
  const hasActiveSearch = searchQuery.trim().length >= 2;

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-black pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 max-w-[1400px]">

        {/* ─── BARRE DE RECHERCHE ─── */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSearchQuery(inputValue.trim());
            }}
            className="relative w-full lg:max-w-md flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 px-5 py-3 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
          >
            <Search className="text-gray-300 w-5 h-5 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher un produit à comparer..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[13px] font-bold dark:text-white placeholder:text-gray-400"
            />
            {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0" />}
          </form>

          <div className="flex w-full lg:w-auto flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-end gap-3 min-w-0">
            {/* Filtre villes */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1a1a1a] px-3 py-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-x-auto no-scrollbar min-w-0 max-w-full">
              <Filter className="w-4 h-4 text-[#2D5A27] shrink-0" />
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`whitespace-nowrap text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl transition-all ${selectedCity === city
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => setOnlyVerified((value) => !value)}
                className={`h-10 px-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${onlyVerified
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400'
                  }`}
              >
                Vérifiés
              </button>

              {/* Tri */}
              <div className="h-10 flex items-center justify-center gap-2 bg-[#E67E22]/10 px-3 rounded-full border border-[#E67E22]/20 min-w-0">
                <span className="material-symbols-outlined text-[12px] text-[#E67E22] shrink-0">sort</span>
                <select
                  className="min-w-0 bg-transparent text-[9px] font-black uppercase tracking-widest text-[#E67E22] outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Trier les offres"
                >
                  <option value="price_asc">Moins cher</option>
                  <option value="price_desc">Plus cher</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ─── HERO PRODUIT ─── */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] p-4 sm:p-5 lg:p-10 mb-8 lg:mb-16 shadow-sm overflow-hidden flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-10 items-center">
          <div className="relative size-28 sm:size-32 lg:size-56 shrink-0 rounded-[1.25rem] lg:rounded-[2rem] overflow-hidden shadow-xl border-4 border-gray-50 dark:border-white/5">
            {featured?.image ? (
              <Image src={featured.image} alt={featured.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-200" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center lg:text-left space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Analyse de marché — {filtered.length} offre{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-deep-blue dark:text-white tracking-tighter uppercase leading-tight lg:leading-[0.9] break-words">
                {searchQuery || 'Rechercher un produit'}
              </h1>
              {featured && (
                <p className="text-xs sm:text-[13px] font-medium text-gray-400 max-w-xl line-clamp-3 sm:line-clamp-2">
                  {featured.description}
                </p>
              )}
              {!featured && (
                <p className="text-xs sm:text-sm font-medium text-gray-400 max-w-xl mx-auto lg:mx-0">
                  Comparez les offres disponibles, trouvez le meilleur prix et contactez directement le vendeur.
                </p>
              )}
            </div>

            {!featured && (
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {quickSearches.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => runQuickSearch(query)}
                    className="h-9 px-4 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}

            {featured ? (
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-10 pt-2 sm:pt-4">
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Moyenne</p>
                  <p className="text-2xl sm:text-3xl font-black text-deep-blue dark:text-white break-words">{filteredAvg} $</p>
                </div>
                {filteredMin !== filteredMax && (
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Fourchette</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-600 break-words">{filteredMin} $ – {filteredMax} $</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2">
                {['Recherche rapide', 'Prix comparés', 'Vendeurs directs'].map((label) => (
                  <div key={label} className="rounded-2xl bg-gray-50 dark:bg-white/5 px-4 py-3 border border-gray-100 dark:border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── DIVIDER ─── */}
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 text-gray-200 dark:text-white/10">
          <div className="flex-1 h-px bg-current"></div>
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-gray-300 dark:text-white/20 whitespace-nowrap">Transaction Sécurisée</span>
          <div className="flex-1 h-px bg-current"></div>
        </div>

        {/* ─── GRILLE PRODUITS ─── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filtered.map((product, idx) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-500"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <SellerCard
                  product={product}
                  isBestPrice={product.price === filteredMin && filtered.length > 1}
                />
              </div>
            ))}
          </div>
        ) : hasActiveSearch ? (
          <div className="col-span-full overflow-hidden rounded-3xl border border-[#E67E22]/20 bg-white dark:bg-[#1a1a1a] shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 sm:p-8 lg:p-10 text-center lg:text-left">
                <div className="mx-auto lg:mx-0 mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#E67E22]/10 text-[#E67E22] ring-1 ring-[#E67E22]/20">
                  <Search className="w-7 h-7" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-3">
                  Aucun résultat
                </p>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#2D5A27] dark:text-white">
                  Aucun produit trouvé pour &ldquo;{searchQuery}&rdquo;
                </h2>
                <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                  Essayez un nom plus simple ou comparez une catégorie populaire pour trouver des offres disponibles.
                </p>
                <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2">
                  {quickSearches.map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => runQuickSearch(query)}
                      className="h-10 px-4 rounded-full bg-[#2D5A27] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#24481f] transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#2D5A27] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-4">
                  Conseil recherche
                </p>
                <div className="space-y-3">
                  {['Utilisez 1 ou 2 mots clés', 'Évitez les marques trop longues', 'Vérifiez la ville sélectionnée'].map((tip) => (
                    <div key={tip} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#E67E22] shrink-0" />
                      <span className="text-sm font-bold">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickSearches.slice(0, 3).map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => runQuickSearch(query)}
                className="text-left bg-white dark:bg-[#1a1a1a] border border-[#E67E22]/15 rounded-2xl p-4 hover:border-[#E67E22]/50 hover:shadow-lg hover:shadow-[#E67E22]/10 transition-all"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-[#E67E22] mb-1">Comparer</p>
                <p className="text-lg font-black text-[#2D5A27] dark:text-white uppercase">{query}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
