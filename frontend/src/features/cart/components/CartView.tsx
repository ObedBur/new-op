"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckoutModal } from "./CheckoutModal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import { ProductMapper } from "@/features/products/services/product.mapper";
import { getProductImageUrl } from "@/lib/image-utils";

export const CartView: React.FC = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    isMounted,
  } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckoutSubmit = async (data: any) => {
    try {
      // On envoie une seule requête groupée pour tout le panier
      await api.post("/orders/bulk", {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        customerName: data.fullName,
        customerPhone: data.phone,
        customerEmail: data.email,
        deliveryAddress: data.address,
      });

      setIsCheckoutModalOpen(false);
      await clearCart();
      router.push("/cart/success");
    } catch (error) {
      console.error("Checkout failed:", error);
      showToast("Commande impossible. Vérifiez le stock ou réessayez.", "error");
    }
  };

  // Get currency from the first item if available, default to $
  const firstItemPriceInfo = items.length > 0 ? ProductMapper.parsePrice(items[0].product.displayPrice || items[0].product.price) : { currency: '$' };
  const currencySymbol = firstItemPriceInfo.currency;

  if (!isMounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="size-24 md:size-32 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-gray-200 text-5xl md:text-6xl">
            shopping_cart_off
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-deep-blue dark:text-white mb-4">
          Votre panier est vide
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          Découvrez nos meilleurs prix en Afrique et commencez votre shopping
          local dès maintenant.
        </p>
        <Link href="/products">
          <Button size="lg">Voir les produits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-3 py-6 sm:px-4 md:py-10 animate-in fade-in duration-700">
      <div className="bg-[#FDFBF7] dark:bg-zinc-900 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-4 sm:p-6 md:p-10 lg:p-14 xl:p-20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-black/[0.03] dark:border-white/5">
        {/* BREADCRUMBS (Inspired by image) */}
        <div className="flex flex-wrap items-center gap-2 mb-8 md:mb-10 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
          <span className="text-gray-300">/</span>
          <Link href="/cart" className="hover:text-black transition-colors">Panier</Link>
          <span className="text-gray-300">/</span>
          <span className="text-black dark:text-white">Commande</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#8B4513] dark:text-white tracking-tight md:tracking-tighter leading-none uppercase mb-10 md:mb-16">
          Mon panier
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 md:gap-16 xl:gap-24">

          {/* LEFT COLUMN: RÉSUMÉ (Replacing the form) */}
          <div className="flex-1 order-2 lg:order-1 max-w-2xl">
            <div className="space-y-8 md:space-y-12">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#8B4513] dark:text-white uppercase tracking-tight md:tracking-tighter mb-6 md:mb-8">
                  Résumé
                </h3>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-white/5 pb-4">
                    <span className="font-bold text-gray-400 uppercase text-[11px] tracking-[0.2em]">
                      Sous-total
                    </span>
                    <span className="font-black text-black dark:text-white text-lg">
                      {subtotal.toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-white/5 pb-4">
                    <span className="font-bold text-gray-400 uppercase text-[11px] tracking-[0.2em]">
                      Livraison / retrait
                    </span>
                    <span className="font-black text-[#2D5A27] text-[11px] uppercase tracking-widest bg-[#2D5A27]/5 px-3 py-1 rounded-full">
                      À discuter
                    </span>
                  </div>
                  <div className="pt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <span className="font-black text-black dark:text-white uppercase text-sm tracking-[0.3em]">
                      Total
                    </span>
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#A64B2A] break-words">
                      {total.toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 md:pt-8">
                <Button
                  className="w-full min-h-14 py-4 sm:py-6 md:py-8 bg-[#A64B2A] hover:bg-[#8B3A1E] text-white shadow-2xl shadow-orange-900/20 font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[11px] sm:text-[13px] rounded-2xl border-none transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-normal text-center"
                  onClick={() => {
                    if (!user) {
                      showToast("Veuillez vous connecter pour commander", "error");
                      router.push("/login?redirect=/cart");
                      return;
                    }
                    setIsCheckoutModalOpen(true);
                  }}
                  leftIcon={
                    <span className="material-symbols-outlined text-[24px]">
                      send
                    </span>
                  }
                >
                  Envoyer la commande
                </Button>
                <Link href="/products" className="block text-center mt-6 group">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-[#A64B2A] transition-colors relative">
                    Continuer les achats
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#A64B2A] transition-all group-hover:w-full"></span>
                  </span>
                </Link>
              </div>

              <div className="pt-8 md:pt-12 grid grid-cols-3 gap-3 sm:flex sm:items-center sm:justify-start sm:gap-8 opacity-20 grayscale pointer-events-none border-t border-gray-100 dark:border-white/5">
                <div className="flex flex-col items-center gap-2 min-w-0">
                  <svg className="shrink-0 text-[#25D366] fill-current" width="30" height="30" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center">Discussion<br />WhatsApp</span>
                </div>
                <div className="flex flex-col items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-3xl">local_shipping</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center">Retrait ou<br />livraison</span>
                </div>
                <div className="flex flex-col items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center">Garantie<br />WapiBei</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ITEMS & SUMMARY */}
          <div className="w-full lg:w-[450px] space-y-8 md:space-y-12 order-1 lg:order-2">
            <div className="space-y-6 md:space-y-8">
              {items.map((item) => {
                const { amount, currency } = ProductMapper.parsePrice(item.product.displayPrice || item.product.price);
                const itemTotal = item.product.price * item.quantity;

                return (
                  <div key={item.product.id} className="grid grid-cols-[88px_1fr] gap-4 sm:grid-cols-[112px_1fr] md:grid-cols-[128px_1fr] md:gap-6 group">
                    <div className="size-22 sm:size-28 md:size-32 rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 shrink-0 relative">
                      <Image
                        src={getProductImageUrl(item.product.image)}
                        alt={item.product.name}
                        fill
                        unoptimized={item.product.image?.includes('unsplash.com') ?? false}
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/shopping-cart.png'; }}
                      />
                    </div>
                    <div className="min-w-0 py-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                          <h4 className="text-xs sm:text-sm md:text-md font-black text-deep-blue dark:text-white uppercase leading-tight break-words">{item.product.name}</h4>
                          <p className="text-sm md:text-md font-black text-[#A64B2A] shrink-0">{itemTotal.toLocaleString()} {currencySymbol}</p>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Vendeur: <span className="text-gray-600 dark:text-gray-300">{item.product.user?.boutiqueName || "WapiBei"}</span>
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Ville: <span className="text-gray-600 dark:text-gray-300">{item.product.city}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
                        <div className="flex items-center justify-center gap-3 bg-white dark:bg-black/20 rounded-xl px-3 py-1 border border-black/5 w-fit">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="text-[#A64B2A] hover:scale-125 transition-transform"><span className="material-symbols-outlined text-sm">remove</span></button>
                          <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="text-[#A64B2A] hover:scale-125 transition-transform"><span className="material-symbols-outlined text-sm">add</span></button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <button className="text-[10px] font-black text-gray-300 hover:text-[#A64B2A] uppercase tracking-widest transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">favorite</span> Favoris
                          </button>
                          <button onClick={() => removeItem(item.product.id)} className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">close</span> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seller discussion note */}
            <div className="pt-10 border-t border-gray-100 dark:border-white/5">
              <div className="rounded-2xl bg-[#2D5A27]/5 border border-[#2D5A27]/10 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#2D5A27]">
                  Après validation
                </p>
                <p className="mt-2 text-xs font-bold leading-6 text-gray-500 dark:text-gray-400">
                  Le vendeur reçoit votre commande et vous contacte pour confirmer
                  le prix final, la disponibilité et les modalités sur WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSubmit={handleCheckoutSubmit}
        total={total}
        currency={currencySymbol}
        initialData={{
          fullName: user?.fullName,
          email: user?.email,
          phone: user?.phone,
          address: user?.address || "",
        }}
      />
    </div>
  );
};
