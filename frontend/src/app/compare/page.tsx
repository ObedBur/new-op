'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Info,
  Filter,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { compareProducts, CompareProduct, CompareStats } from '@/features/compare/compare.service';

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
      className={`relative bg-white dark:bg-[#1a1a1a] border ${
        isBestPrice
          ? 'border-emerald-500 shadow-2xl scale-[1.02] z-10'
          : 'border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1'
      } rounded-[2rem] p-4 flex flex-col transition-all duration-500 group`}
    >
      {isBestPrice && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-[8px] font-black uppercase tracking-widest text-white rounded-full shadow-lg z-20 whitespace-nowrap">
          🏆 Meilleur Prix
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
        className={`mb-4 p-3 rounded-2xl text-center ${
          isBestPrice
            ? 'bg-emerald-50 dark:bg-emerald-500/5'
            : 'bg-gray-50 dark:bg-white/5'
        }`}
      >
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
          Prix
        </p>
        <span
          className={`text-2xl font-black tracking-tighter ${
            isBestPrice
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-deep-blue dark:text-white'
          }`}
        >
          {product.displayPrice || `${product.price} $`}
        </span>
      </div>

      {/* Boutons */}
      <div className="grid grid-cols-1 gap-2 mt-auto">
        <Link href={waLink} target="_blank" className="block">
          <Button
            variant="outline"
            className="w-full h-9 text-[9px] font-black uppercase tracking-widest rounded-xl border-gray-100 dark:border-white/5"
          >
            <Phone className="w-3 h-3 mr-2 text-emerald-600" /> WhatsApp
          </Button>
        </Link>
        <Link href={`/products/${product.id}`} className="block">
          <Button className="w-full h-9 bg-[#2D5A27] hover:bg-[#1e3f1a] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-95">
            <ShoppingCart className="w-3 h-3 mr-2" /> Voir l'offre
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
  const [searchQuery, setSearchQuery] = useState('riz');
  const [inputValue, setInputValue] = useState('riz');
  const [sortBy, setSortBy] = useState('price_asc');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [stats, setStats] = useState<CompareStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch depuis l'API Backend
  const fetchCompare = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await compareProducts(q.trim());
      if (res.success) {
        setProducts(res.products);
        setStats(res.stats || null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompare(searchQuery);
  }, [searchQuery, fetchCompare]);

  // Debounce input
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(inputValue), 600);
    return () => clearTimeout(t);
  }, [inputValue]);

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

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-[1400px]">

        {/* ─── BARRE DE RECHERCHE ─── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full lg:max-w-md flex items-center gap-3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 px-5 py-3 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="text-gray-300 w-5 h-5 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher un produit à comparer..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[13px] font-bold dark:text-white placeholder:text-gray-400"
            />
            {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0" />}
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">
            {/* Filtre villes */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1a1a1a] px-3 py-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-x-auto no-scrollbar">
              <Filter className="w-4 h-4 text-[#2D5A27] shrink-0" />
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`whitespace-nowrap text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl transition-all ${
                    selectedCity === city
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                      : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Tri */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tri :</span>
              <select
                className="bg-transparent text-[9px] font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400 outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price_asc">Moins cher</option>
                <option value="price_desc">Plus cher</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>

            {/* Vérifiés */}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                onlyVerified
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-green-900/10'
                  : 'bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-white/5 text-gray-400 hover:border-emerald-500/30'
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${onlyVerified ? 'text-white' : 'text-emerald-600'}`} />
              Vérifiés
            </button>
          </div>
        </div>

        {/* ─── HERO PRODUIT ─── */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-6 lg:p-10 mb-16 shadow-sm overflow-hidden flex flex-col lg:flex-row gap-10 items-center">
          <div className="relative size-40 lg:size-56 shrink-0 rounded-[2rem] overflow-hidden shadow-xl border-4 border-gray-50 dark:border-white/5">
            {featured?.image ? (
              <Image src={featured.image} alt={featured.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-200" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Analyse de marché — {filtered.length} offre{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-black text-deep-blue dark:text-white tracking-tighter uppercase leading-[0.9]">
                {searchQuery || 'Rechercher un produit'}
              </h1>
              {featured && (
                <p className="text-[13px] font-medium text-gray-400 max-w-xl line-clamp-2">
                  {featured.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 pt-4">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Moyenne</p>
                <p className="text-3xl font-black text-deep-blue dark:text-white">{filteredAvg} $</p>
              </div>
              {filteredMin !== filteredMax && (
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Fourchette</p>
                  <p className="text-2xl font-black text-emerald-600">{filteredMin} $ – {filteredMax} $</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── DIVIDER ─── */}
        <div className="flex items-center gap-4 mb-10 text-gray-200 dark:text-white/10">
          <div className="flex-1 h-px bg-current"></div>
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 dark:text-white/20">Transaction Sécurisée</span>
          <div className="flex-1 h-px bg-current"></div>
        </div>

        {/* ─── GRILLE PRODUITS ─── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
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
        ) : (
          <div className="col-span-full py-24 text-center bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-[2.5rem]">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">
              Aucun produit trouvé pour &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-gray-300 font-medium text-xs mt-2">Essayez &ldquo;riz&rdquo;, &ldquo;tomate&rdquo;, &ldquo;huile&rdquo;...</p>
          </div>
        )}

        {/* ─── FOOTER ─── */}
        <div className="mt-20 py-10 border-t border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 text-center">
          <Info className="w-5 h-5 text-gray-200 dark:text-white/10" />
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest max-w-sm">
            WapiBei audite systématiquement les prix listés pour garantir la transparence du marché.
          </p>
        </div>

      </div>
    </main>
  );
}