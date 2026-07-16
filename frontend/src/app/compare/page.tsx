'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Phone,
  ShoppingCart,
  Star,
  MapPin,
  Package,
  Filter,
  Loader2,
  TrendingUp,
  Search,
  Scale,
  MessageCircle,
  ArrowRight,
  X,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { compareProducts, CompareProduct } from '@/features/compare/compare.service';
import { getBestSellers } from '@/features/products/services/product.service';
import { Product } from '@/types';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/features/cart/context/CartContext';


// ─────────────────────────────────────────────
// SELLER CARD
// ─────────────────────────────────────────────
const SellerCard: React.FC<{ product: CompareProduct; isBestPrice: boolean }> = ({
  product,
  isBestPrice,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const { addItem } = useCart();
  const shopName = product.user.boutiqueName || product.user.fullName;
  const rating = Math.min(5, Math.max(1, Math.round(product.user.trustScore / 20)));
  const city = product.user.city || product.city || product.user.province;
  const waMsg = encodeURIComponent(
    `Bonjour ${shopName}, je souhaite commander "${product.name}" vu sur WapiBei.`
  );
  const waLink = `https://wa.me/${(product.user.phone || '').replace(/[^0-9]/g, '')}?text=${waMsg}`;

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

      {/* Product Image (if available) */}
      {(product.images && product.images.length > 0 || product.image) && (
        <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100 dark:bg-white/5 relative">
          <Image
            src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
            alt={product.name}
            fill
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Nom du produit (prominent) */}
      <h3 className="text-[14px] font-black text-deep-blue dark:text-white line-clamp-2 mb-3">
        {product.name}
      </h3>

      {/* Prix (very prominent) */}
      <div
        className={`mb-3 p-2 rounded-xl text-center ${isBestPrice
          ? 'bg-emerald-50 dark:bg-emerald-500/5'
          : 'bg-gray-50 dark:bg-white/5'
          }`}
      >
        <span
          className={`text-2xl sm:text-3xl font-black tracking-tighter break-words ${isBestPrice
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-[#E67E22] dark:text-orange-400'
            }`}
        >
          {product.displayPrice || `${product.price} $`}
        </span>
      </div>

      {/* Seller info (less prominent) */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative shrink-0">
          <div className="size-8 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5">
            <Image
              src={
                product.user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(shopName)}&background=random&size=100`
              }
              alt={shopName}
              width={32}
              height={32}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate">
            {shopName}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-2 h-2 fill-amber-400 text-amber-400" />
            <span className="text-[8px] font-bold text-gray-400">
              {rating}.0 / 5
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-gray-500">
          <MapPin className="w-2.5 h-2.5 text-emerald-600" />
          <span className="truncate">{city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-gray-500">
          <Package className="w-2.5 h-2.5" />
          <span>{product.availability === 'IN_STOCK' ? 'En stock' : product.availability === 'LIMITED_STOCK' ? 'Stock limité' : 'Rupture'}</span>
        </div>
      </div>

      {/* Boutons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <Link 
          href={waLink} 
          target="_blank" 
          className="flex items-center justify-center w-full h-9 text-[9px] font-black uppercase tracking-widest rounded-xl border-2 border-gray-100 dark:border-white/5 px-1 hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95 text-gray-700 dark:text-gray-300"
        >
          <Phone className="w-3 h-3 mr-1.5 text-emerald-600 shrink-0" /> <span className="truncate">WhatsApp</span>
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-full h-9 bg-[#E67E22] hover:bg-[#d5731f] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-900/10 transition-all active:scale-95 px-1"
        >
          <ShoppingCart className="w-3 h-3 mr-1.5 shrink-0" /> <span className="truncate">Voir</span>
        </button>
      </div>

      {/* QUICK VIEW MODAL — rendu via Portal pour échapper au contexte transform de la carte */}
      {isModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl p-5 sm:p-10 animate-in fade-in zoom-in-95 duration-200 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6 pr-8">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 dark:border-white/10">
                <Image
                  src={product.images?.[0] || product.image || '/placeholder-product.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">{product.name}</h3>
                <span className="text-3xl font-black text-[#E67E22]">{product.displayPrice || `${product.price} $`}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Vendu par</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200 shrink-0">
                  <Image
                    src={product.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(shopName)}&background=random`}
                    alt={shopName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-deep-blue dark:text-white">{shopName}</span>
                    {product.user.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" fill="currentColor" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {Math.min(5, Math.max(1, Math.round(product.user.trustScore / 20)))}/5</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {city}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href={`/sellers/${product.user.id}`} onClick={() => setIsModalOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl border-2 font-black uppercase tracking-widest text-[10px] h-12 hover:bg-gray-50 dark:hover:bg-white/5">
                  <Store className="w-4 h-4 mr-2 text-[#2D5A27]" />
                  Visiter la boutique
                </Button>
              </Link>
              <Button 
                className="w-full rounded-xl bg-[#E67E22] hover:bg-[#d5731f] text-white font-black uppercase tracking-widest text-[10px] h-12 shadow-lg shadow-orange-900/10"
                onClick={() => {
                  try {
                    addItem(product as unknown as Product, 1);
                  } catch {/* ignore */}
                  setIsModalOpen(false);
                  showToast(`"${product.name}" ajouté au panier !`, 'success');
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier
              </Button>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

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
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-3">
            <Scale className="w-10 h-10 text-[#2D5A27] dark:text-emerald-400 -rotate-3" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#2D5A27] dark:text-white tracking-tighter mb-4 uppercase">
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
            <MessageCircle className="w-5 h-5" />
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
            {[...Array(6)].map((_, i) => (
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

  // Filtres & Tri
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [availability, setAvailability] = useState<'ALL' | 'IN_STOCK'>('ALL');
  const [condition, setCondition] = useState<'ALL' | 'NEW' | 'USED'>('ALL');
  const [sortBy, setSortBy] = useState('price_asc');
  
  // UI Mobile
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

  // 3. Appliquer Filtres et Tri
  const filtered = useMemo(() => {
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

    return result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.user.trustScore - a.user.trustScore;
      return 0;
    });
  }, [products, isVerifiedOnly, minPrice, maxPrice, selectedCities, selectedShops, sortBy, availability]);

  const filteredPrices = filtered.map((p) => p.price);
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
    setCondition('ALL');
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

      {/* État (Condition) */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">État</h4>
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => setCondition('ALL')}
            className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${condition === 'ALL' ? 'bg-[#2D5A27] border-[#2D5A27] text-white shadow-md' : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:border-[#2D5A27] hover:text-[#2D5A27] dark:hover:border-emerald-500 dark:hover:text-emerald-500'}`}
          >
            Tout
          </button>
          <button 
            type="button"
            onClick={() => setCondition('NEW')}
            className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${condition === 'NEW' ? 'bg-[#2D5A27] border-[#2D5A27] text-white shadow-md' : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:border-[#2D5A27] hover:text-[#2D5A27] dark:hover:border-emerald-500 dark:hover:text-emerald-500'}`}
          >
            Neuf
          </button>
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
                {products.length} offre{products.length !== 1 ? 's' : ''} trouvée{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Bouton Filtres Mobile */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400 shadow-sm active:scale-95 transition-all"
              >
                <Filter className="w-4 h-4 text-[#E67E22]" /> Filtrer & Trier
              </button>
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
            {products.length > 0 && !loading && (
              <div className="hidden lg:flex items-center justify-between bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-3 shadow-sm mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {filtered.length} Résultat{filtered.length !== 1 ? 's' : ''}
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
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filtered.map((product, idx) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-6 duration-500 h-full"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <SellerCard
                      product={product}
                      isBestPrice={product.price === filteredMin && filtered.length > 1}
                    />
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

      {/* BOTTOM SHEET MOBILE POUR LES FILTRES */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop sombre */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          
          {/* Panel */}
          <div className="relative w-full bg-white dark:bg-[#121212] rounded-t-[2rem] p-6 pb-safe max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            {/* Grip de tirage */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-gray-200 dark:bg-white/20" />
            
            <div className="flex items-center justify-between mb-6 mt-2">
              <h2 className="text-lg font-black uppercase tracking-widest text-[#2D5A27] dark:text-emerald-400">Filtrer & Trier</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-500 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
              {/* Tri mobile */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Trier par</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'price_asc', label: 'Moins cher' },
                    { val: 'price_desc', label: 'Plus cher' },
                    { val: 'rating', label: 'Mieux notés' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setSortBy(opt.val)}
                      className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${sortBy === opt.val ? 'bg-[#2D5A27] border-[#2D5A27] text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-px bg-gray-100 dark:bg-white/5" />
              
              <FilterOptions />
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-4 bg-[#E67E22] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#E67E22]/20 active:scale-95 transition-all"
              >
                Afficher ({filtered.length})
              </button>
            </div>
          </div>
        </div>
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
