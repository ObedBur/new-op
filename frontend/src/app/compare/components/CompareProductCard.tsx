import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle,
  Phone,
  ShoppingCart,
  Star,
  MapPin,
  Package,
  Heart,
  Store,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CompareProduct } from '@/features/compare/compare.service';

interface CompareProductCardProps {
  product: CompareProduct;
  isBestPrice: boolean;
}

export const CompareProductCard: React.FC<CompareProductCardProps> = ({
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

  // Use mock values if undefined
  const isShopOpen = product.isShopOpen !== false;
  const hasPromo = product.hasPromo === true;

  return (
    <div
      className={`relative bg-white dark:bg-[#1a1a1a] border ${isBestPrice
        ? 'border-emerald-500 shadow-xl sm:shadow-2xl sm:scale-[1.02] z-10'
        : 'border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1'
        } rounded-[2rem] p-4 sm:p-5 flex flex-col transition-all duration-500 group overflow-hidden`}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
        <div className="flex gap-2">
          {isBestPrice && (
            <div className="px-3 py-1 bg-emerald-500 text-[9px] font-black uppercase tracking-widest text-white rounded-full shadow-lg whitespace-nowrap">
              Meilleur Prix
            </div>
          )}
          {hasPromo && (
            <div className="px-3 py-1 bg-[#E67E22] text-[9px] font-black uppercase tracking-widest text-white rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
              <Tag className="w-3 h-3" /> Promo
            </div>
          )}
        </div>
        <button className="size-8 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-[#2a2a2a] transition-all shadow-sm">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Image du Produit */}
      <div className="relative w-full h-40 sm:h-48 mt-12 mb-5 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shrink-0">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300 dark:text-white/10" />
          </div>
        )}
      </div>

      {/* Header: Avatar + Nom */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative shrink-0">
          <div className="size-10 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-[#2a2a2a] shadow-sm">
            <Image
              src={
                product.user.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(shopName)}&background=random&size=100`
              }
              alt={shopName}
              width={40}
              height={40}
              className={`w-full h-full object-cover rounded-full transition-all duration-500 ${!isShopOpen ? 'grayscale opacity-50' : ''}`}
            />
          </div>
          {product.user.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1a1a1a] rounded-full p-0.5">
              <CheckCircle className="w-4 h-4 text-blue-500" fill="currentColor" />
            </div>
          )}
          {!isShopOpen && (
            <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1a1a]"></div>
          )}
          {isShopOpen && (
            <div className="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1a1a1a]"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/sellers/${product.user.id}`} className="hover:underline">
            <h4 className="text-sm font-black text-deep-blue dark:text-white truncate uppercase tracking-tight leading-tight flex items-center gap-1.5">
              {shopName}
            </h4>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black text-gray-500">
              {rating}.0 / 5
            </span>
          </div>
        </div>
      </div>

      {/* Nom du produit */}
      <p className="text-xs font-bold text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 flex-1">
        {product.name}
      </p>

      {/* Stats */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
          <MapPin className="w-3.5 h-3.5 text-[#E67E22]" />
          <span className="truncate">{city}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 dark:text-gray-400">
          <Package className="w-3.5 h-3.5 text-blue-500" />
          <span>{product.availability === 'IN_STOCK' ? 'En stock' : product.availability === 'LIMITED_STOCK' ? 'Stock limité' : 'Rupture'}</span>
        </div>
        {product.deliveryOptions?.homeDelivery && (
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-500">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Livraison disponible</span>
          </div>
        )}
      </div>

      {/* Prix */}
      <div
        className={`mb-5 p-4 rounded-2xl text-center ${isBestPrice
          ? 'bg-emerald-50 dark:bg-emerald-500/10'
          : 'bg-gray-50 dark:bg-white/5'
          }`}
      >
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
          Prix
        </p>
        <div className="flex items-center justify-center gap-2">
          {hasPromo && <span className="text-sm font-bold text-gray-400 line-through">{(product.price * 1.2).toFixed(1)}$</span>}
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tighter break-words ${isBestPrice
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-deep-blue dark:text-white'
              }`}
          >
            {product.displayPrice || `${product.price} $`}
          </span>
        </div>
      </div>

      {/* Boutons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <Link href={`/products/${product.id}`} className="block col-span-2">
          <Button className="w-full h-10 bg-[#2D5A27] hover:bg-[#1e3f1a] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 transition-all active:scale-95">
            <ShoppingCart className="w-3.5 h-3.5 mr-2 shrink-0" /> Commander
          </Button>
        </Link>
        <Link href={waLink} target="_blank" className="block">
          <Button
            variant="outline"
            className="w-full h-9 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
          >
            <Phone className="w-3 h-3 mr-1.5 shrink-0" /> WhatsApp
          </Button>
        </Link>
        <Link href={`/sellers/${product.user.id}`} className="block">
          <Button
            variant="outline"
            className="w-full h-9 text-[9px] font-black uppercase tracking-widest rounded-xl border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            <Store className="w-3 h-3 mr-1.5 shrink-0" /> Boutique
          </Button>
        </Link>
      </div>
    </div>
  );
};
