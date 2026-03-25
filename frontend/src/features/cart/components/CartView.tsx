"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckoutModal } from "./CheckoutModal";
import { useToast } from "@/context/ToastContext";
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
      showToast(
        "Commande validée ! Un seul e-mail de confirmation vous a été envoyé.",
        "success",
      );
      clearCart();
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
    <div className="container mx-auto max-w-5xl px-3 sm:px-4 py-8 md:py-16 animate-in fade-in duration-500">
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-6 bg-[#E67E22]"></span>
          <span className="text-[10px] font-black text-[#E67E22] uppercase tracking-[0.2em]">
            Votre Sélection
          </span>
        </div>
        <h2 className="text-3xl md:text-6xl font-black text-deep-blue dark:text-white tracking-tight leading-none">
          Mon Panier
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ITEMS LIST */}
        <div className="flex-1 space-y-4">
          {items.map((item) => {
            const { amount, currency } = ProductMapper.parsePrice(item.product.displayPrice || item.product.price);
            const itemTotal = item.product.price * item.quantity;

            return (
              <Card
                key={item.product.id}
                className="p-4 md:p-6 flex items-center gap-4 md:gap-6 group"
                padding="none"
              >
                <div className="size-20 md:size-28 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 shrink-0 border border-gray-100 dark:border-white/5 relative">
                  <Image
                    src={item.product.image}
                    className="object-cover"
                    alt={item.product.name}
                    fill
                    sizes="(max-width: 768px) 80px, 112px"
                  />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm md:text-lg font-black text-deep-blue dark:text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        {item.product.user?.boutiqueName ||
                          item.product.user?.fullName ||
                          "Vendeur WapiBei"}{" "}
                        • {item.product.city}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-300 hover:text-red-500 hover:bg-transparent"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </Button>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/10">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="size-8 rounded-lg hover:bg-white dark:hover:bg-white/10 text-[#E67E22] dark:text-white"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          remove
                        </span>
                      </Button>
                      <span className="w-8 text-center text-xs font-black text-deep-blue dark:text-white">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="size-8 rounded-lg hover:bg-white dark:hover:bg-white/10 text-[#E67E22] dark:text-white"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          add
                        </span>
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                        Prix total
                      </p>
                      <p className="text-lg md:text-xl font-black text-[#E67E22]">
                        {itemTotal.toLocaleString()} {currency}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* SUMMARY CARD */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <Card className="p-8 shadow-2xl sticky top-24" padding="none">
            <h3 className="text-xl font-black text-deep-blue dark:text-white mb-8">
              Résumé
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-500 uppercase text-[11px] tracking-widest">
                  Sous-total
                </span>
                <span className="font-black text-deep-blue dark:text-white">
                  {subtotal.toLocaleString()} {currencySymbol}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-500 uppercase text-[11px] tracking-widest">
                  Livraison Standard
                </span>
                <span className="font-black text-[#2D5A27] text-[10px] uppercase tracking-wider">
                  À discuter
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                <span className="font-black text-deep-blue dark:text-white uppercase text-xs tracking-[0.2em]">
                  Total
                </span>
                <span className="text-2xl md:text-3xl font-black text-[#E67E22]">
                  {total.toLocaleString()} {currencySymbol}
                </span>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <Button
                className="w-full py-6 bg-[#E67E22] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 font-black uppercase tracking-widest text-[12px] rounded-2xl border-none"
                onClick={() => setIsCheckoutModalOpen(true)}
                leftIcon={
                  <span className="material-symbols-outlined text-[22px]">
                    payment
                  </span>
                }
              >
                Passer au paiement
              </Button>
              <Link href="/products" className="block text-center mt-4">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E67E22] hover:underline decoration-2 underline-offset-8 transition-all">
                  Continuer les achats
                </span>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale pointer-events-none">
              <span className="material-symbols-outlined">payments</span>
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="material-symbols-outlined">verified_user</span>
            </div>
          </Card>
        </aside>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSubmit={handleCheckoutSubmit}
        total={total}
        currency={currencySymbol}
      />
    </div>
  );
};

