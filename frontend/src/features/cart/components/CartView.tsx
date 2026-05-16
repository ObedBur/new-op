"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckoutModal } from "./CheckoutModal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import { ProductMapper } from "@/features/products/services/product.mapper";

export const CartView: React.FC = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

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
      clearCart();
      window.location.href = "/cart/success";
    } catch (error) {
      console.error("Checkout failed:", error);
      showToast("Erreur lors de la commande. Veuillez réessayer.", "error");
    }
  };

  // Get currency from the first item if available, default to $
  const firstItemPriceInfo = items.length > 0 ? ProductMapper.parsePrice(items[0].product.displayPrice || items[0].product.price) : { currency: '$' };
  const currencySymbol = firstItemPriceInfo.currency;

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
    <div className="container mx-auto max-w-7xl px-4 animate-in fade-in duration-700">
      <div className="bg-[#FDFBF7] dark:bg-zinc-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 lg:p-20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-black/[0.03] dark:border-white/5">

        {/* BREADCRUMBS (Inspired by image) */}
        <div className="flex items-center gap-2 mb-10 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
          <span className="text-gray-300">/</span>
          <Link href="/cart" className="hover:text-black transition-colors">Panier</Link>
          <span className="text-gray-300">/</span>
          <span className="text-black dark:text-white">Paiement</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-[#8B4513] dark:text-white tracking-tighter leading-none uppercase mb-16">
          Mon panier
        </h2>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

          {/* LEFT COLUMN: RÉSUMÉ (Replacing the form) */}
          <div className="flex-1 order-2 lg:order-1 max-w-2xl">
            <div className="space-y-12">
              <div>
                <h3 className="text-3xl font-black text-[#8B4513] dark:text-white uppercase tracking-tighter mb-8">
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
                      Livraison Standard
                    </span>
                    <span className="font-black text-[#2D5A27] text-[11px] uppercase tracking-widest bg-[#2D5A27]/5 px-3 py-1 rounded-full">
                      À discuter
                    </span>
                  </div>
                  <div className="pt-6 flex justify-between items-center">
                    <span className="font-black text-black dark:text-white uppercase text-sm tracking-[0.3em]">
                      Total
                    </span>
                    <span className="text-4xl md:text-5xl font-black text-[#A64B2A]">
                      {total.toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <Button
                  className="w-full py-8 bg-[#A64B2A] hover:bg-[#8B3A1E] text-white shadow-2xl shadow-orange-900/20 font-black uppercase tracking-[0.2em] text-[13px] rounded-2xl border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  leftIcon={
                    <span className="material-symbols-outlined text-[24px]">
                      payment
                    </span>
                  }
                >
                  Commander maintenant
                </Button>
                <Link href="/products" className="block text-center mt-6 group">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-[#A64B2A] transition-colors relative">
                    Continuer les achats
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#A64B2A] transition-all group-hover:w-full"></span>
                  </span>
                </Link>
              </div>

              <div className="pt-12 flex items-center justify-start gap-8 opacity-20 grayscale pointer-events-none border-t border-gray-100 dark:border-white/5">
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">payments</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center">Paiements<br />Sécurisés</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">local_shipping</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center">Livraison<br />Afrique</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-center">Garantie<br />WapiBei</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ITEMS & SUMMARY */}
          <div className="lg:w-[450px] space-y-12 order-1 lg:order-2">
            <div className="space-y-8">
              {items.map((item) => {
                const { amount, currency } = ProductMapper.parsePrice(item.product.displayPrice || item.product.price);
                const itemTotal = item.product.price * item.quantity;

                return (
                  <div key={item.product.id} className="flex gap-6 group">
                    <div className="size-24 md:size-32 rounded-3xl overflow-hidden bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 shrink-0 relative">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm md:text-md font-black text-deep-blue dark:text-white uppercase leading-tight">{item.product.name}</h4>
                          <p className="text-sm md:text-md font-black text-[#A64B2A]">{itemTotal.toLocaleString()} {currencySymbol}</p>
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

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-white dark:bg-black/20 rounded-xl px-3 py-1 border border-black/5">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="text-[#A64B2A] hover:scale-125 transition-transform"><span className="material-symbols-outlined text-sm">remove</span></button>
                          <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="text-[#A64B2A] hover:scale-125 transition-transform"><span className="material-symbols-outlined text-sm">add</span></button>
                        </div>
                        <div className="flex items-center gap-4">
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

            {/* REDUCED RIGHT FOOTER (Keeping Coupon if needed) */}
            <div className="pt-10 border-t border-gray-100 dark:border-white/5">
              {/* COUPON SECTION */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="CODE PROMO"
                  className="flex-1 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3 text-[10px] font-black tracking-widest focus:outline-none focus:border-[#A64B2A]"
                />
                <button className="bg-[#A64B2A]/10 text-[#A64B2A] px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#A64B2A] hover:text-white transition-colors border border-[#A64B2A]/20">Appliquer</button>
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

