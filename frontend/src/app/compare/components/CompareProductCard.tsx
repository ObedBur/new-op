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
      className={`relative bg-white dark:bg-[#1a1a1a] border ${
        isBestPrice
          ? 'border-emerald-500 shadow-md z-10'
          : 'border-gray-200 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-0.5'
      } rounded-xl flex flex-col transition-all duration-300 group overflow-hidden`}
    >
      {/* Image (Top) */}
      <div className="relative w-full aspect-[4/5] bg-gray-50 dark:bg-white/5 shrink-0 overflow-hidden">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300 dark:text-white/10" />
          </div>
        )}
        
        {/* Badges on image */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isBestPrice && (
            <span className="px-1.5 py-0.5 bg-emerald-500 text-[8px] sm:text-[9px] font-black uppercase text-white rounded shadow-sm">
              Meilleur Prix
            </span>
          )}
          {hasPromo && (
            <span className="px-1.5 py-0.5 bg-[#FF4747] text-[8px] sm:text-[9px] font-black uppercase text-white rounded shadow-sm">
              Promo
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-2 right-2 size-6 sm:size-7 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10">
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Info (Bottom) */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        {/* Title */}
        <Link href={`/products/${product.id}`} className="hover:underline">
          <p className="text-[11px] sm:text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-[1.3] mb-1.5">
            {product.name}
          </p>
        </Link>

        {/* Price & Rating */}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-black text-[#FF4747] tracking-tight">
              {product.displayPrice || `${product.price} $`}
            </span>
            {hasPromo && (
              <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">{(product.price * 1.2).toFixed(1)}$</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
              <span className="text-[9px] sm:text-[10px] text-gray-500">{rating}.0</span>
            </div>
            <span className="text-[8px] sm:text-[9px] text-gray-400 truncate max-w-[70px] flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" /> {city}
            </span>
          </div>

          {/* Shop Info (Miniature) */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
            <Link href={`/sellers/${product.user.id}`} className="flex items-center gap-1.5 flex-1 min-w-0 hover:underline">
              <div className="relative size-4 sm:size-5 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={product.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(shopName)}&background=random&size=32`}
                  alt={shopName}
                  width={20}
                  height={20}
                  className={`w-full h-full object-cover ${!isShopOpen ? 'grayscale opacity-50' : ''}`}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate">{shopName}</span>
            </Link>
            {product.user.isVerified && <CheckCircle className="w-3 h-3 text-blue-500 shrink-0 ml-1" fill="currentColor" />}
          </div>
          
          {/* Quick Action buttons */}
          <div className="grid grid-cols-2 gap-1.5 mt-2.5">
             <Link href={`/products/${product.id}`}>
               <Button className="w-full h-7 bg-[#2D5A27] hover:bg-[#1e3f1a] text-white rounded-md flex items-center justify-center p-0 transition-all active:scale-95 shadow-sm">
                 <ShoppingCart className="w-3.5 h-3.5" />
               </Button>
             </Link>
             <Link href={waLink} target="_blank">
               <Button variant="outline" className="w-full h-7 border-emerald-200 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400 rounded-md flex items-center justify-center p-0 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-95">
                 <Phone className="w-3.5 h-3.5" />
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
