"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  BadgeCheck,
  ChevronRight,
  Package,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Seller } from "../services/seller.service";
import { useT } from "@/i18n/useT";

interface FeaturedStoresProps {
  stores: Seller[];
}

const isValidImageUrl = (url: unknown): url is string => {
  if (typeof url !== "string") return false;

  const trimmed = url.trim();

  if (trimmed.length < 8) return false;
  if (trimmed === "undefined" || trimmed === "null") return false;

  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/")
  );
};

const safeLabel = (
  rawLabel: string | null | undefined,
  fallback: string
): string => {
  if (!rawLabel) return fallback;

  if (
    rawLabel.includes(".featuredStores.") ||
    rawLabel.includes(".home.")
  ) {
    return fallback;
  }

  return rawLabel;
};

export const FeaturedStores: React.FC<FeaturedStoresProps> = ({ stores }) => {
  const { t } = useT();

  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      {/* HEADER */}
      <div className="flex items-end justify-between mb-10 border-b border-gray-100 dark:border-white/5 pb-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#E67E22] uppercase tracking-[0.3em]">
            {safeLabel(
              t("home.featuredStores.pretitle"),
              "Meilleures adresses"
            )}
          </span>

          <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            {safeLabel(
              t("home.featuredStores.title"),
              "Nos vendeurs vérifiés"
            )}
          </h3>
        </div>

        <Link
          href="/sellers"
          className="group flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 hover:text-[#E67E22] dark:hover:text-[#E67E22] transition-all duration-200"
        >
          {safeLabel(
            t("home.featuredStores.exploreAll"),
            "Explorer tout"
          )}

          <ChevronRight
            className="size-[18px] group-hover:translate-x-1 transition-transform"
            strokeWidth={2.5}
          />
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
        {stores.slice(0, 15).map((store, index) => {
          const storeScore = store.trustScore ?? 50;
          const scoreDisplay = (storeScore / 20).toFixed(1);

          const validPreviews = (store.productPreviews || []).filter(
            isValidImageUrl
          );

          const heroImage =
            validPreviews[0] ||
            (isValidImageUrl(store.avatarUrl)
              ? store.avatarUrl
              : null);

          const secondaries = validPreviews.slice(1, 3);
          const extraProducts = store.productCount !== undefined ? Math.max(0, store.productCount - secondaries.length) : 0;

          const safeAvatar =
            store.avatarUrl &&
            store.avatarUrl.length > 8 &&
            store.avatarUrl !== "undefined" &&
            store.avatarUrl !== "null"
              ? store.avatarUrl
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  store.boutiqueName || "V"
                )}&background=E67E22&color=fff&size=128`;

          const isMobileHidden = index >= 8 ? "hidden sm:flex" : "";
          const isTabletHidden = index >= 10 ? "sm:hidden lg:flex" : "";

          return (
            <div
              key={store.id}
              className={`group relative flex-col rounded-[1.75rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 ${isMobileHidden} ${isTabletHidden} flex`}
            >
              {/* CARTE CLIQUABLE */}
              <Link
                href={`/sellers/${store.id}`}
                className="relative block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/[0.02]">
                  
                  {/* IMAGE PRINCIPALE */}
                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt={store.boutiqueName || "Boutique"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#E67E22]/10 via-[#2D5A27]/5 to-transparent">
                      <div className="text-[#2D5A27]/40 text-5xl">
                        ◇
                      </div>
                    </div>
                  )}

                  {/* GRADIENT BAS */}
                  <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/60 via-[35%] to-transparent pointer-events-none" />

                  {/* =====================================================
                      HAUT GAUCHE — PRODUITS
                      ===================================================== */}
                  {store.productCount !== undefined && store.productCount > 0 && (
                    <div className="absolute top-2.5 left-2.5 z-30">
                      <div className="inline-flex items-center gap-1 rounded-full border border-white/35 bg-black/20 backdrop-blur-md px-2 py-1 shadow-lg">
                        <Package
                          className="size-3 text-white"
                          strokeWidth={2}
                        />

                        <span className="text-[9px] md:text-[10px] font-black text-white leading-none">
                          {store.productCount} produits
                        </span>
                      </div>
                    </div>
                  )}

                  {/* =====================================================
                      PROFIL VENDEUR
                      ===================================================== */}
                  <div className="absolute inset-x-0 bottom-0 z-20">
                    <div className="relative p-2.5 md:p-3 flex flex-col gap-2.5">

                      {/* PROFIL */}
                      <div className="flex items-center gap-2.5">
                        
                        {/* AVATAR ROND */}
                        <div className="relative shrink-0 size-10 md:size-12 rounded-full p-[2px] bg-gradient-to-br from-[#E67E22] via-[#E67E22] to-white shadow-xl ring-2 ring-white">
                          <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                            <Image
                              src={safeAvatar}
                              alt={store.boutiqueName || "Boutique"}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>

                          {/* ONLINE — VRAI STATUT BASE SUR API: < 5min de lastSeenAt */}
                          {store.isOnline === true && (
                            <span className="absolute -right-0.5 -bottom-0.5 size-4 md:size-[18px] rounded-full bg-[#22C55E] border-[3px] border-white shadow-md" />
                          )}
                        </div>

                        {/* NOM + INFOS */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 min-w-0">
                            <h4 className="text-[13px] md:text-[14px] font-black text-white leading-tight tracking-tight truncate drop-shadow-md">
                              {store.boutiqueName}
                            </h4>

                            {/* CERTIFICATION — VERT #2D5A27 style premium */}
                            {store.isVerified && (
                              <BadgeCheck
                                className="size-4 md:size-[18px] shrink-0 text-[#2D5A27] fill-white"
                                strokeWidth={1.8}
                              />
                            )}
                          </div>

                          {/* SCORE + VENTES */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex items-center gap-1">
                              <Star
                                className="size-3 text-[#E67E22] fill-current"
                                strokeWidth={0}
                              />

                              <span className="text-[10px] md:text-[11px] font-black text-white">
                                {scoreDisplay}
                              </span>
                            </div>

                            {store.salesCount !== undefined && store.salesCount > 0 && (
                              <>
                                <span className="text-white/45 text-xs">
                                  |
                                </span>

                                <span className="text-[11px] md:text-[12px] font-black text-[#7BC96F]">
                                  {store.salesCount} ventes
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* =====================================================
                          MINIATURES : 2 miniatures + +N
                          ===================================================== */}
                      {store.productCount !== undefined && store.productCount >= 2 && (
                        <div className="flex items-center gap-2">
                          {secondaries.map((preview, i) => (
                            <div
                              key={i}
                              className="relative size-10 md:size-11 rounded-xl overflow-hidden shadow-xl ring-2 ring-white/90 shrink-0 bg-white/10"
                            >
                              <Image
                                src={preview}
                                alt={`${store.boutiqueName || "Boutique"} produit ${
                                  i + 2
                                }`}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                          ))}

                          {/* PLUS : N = productCount - nb miniatures affichées */}
                          {extraProducts > 0 && (
                            <div className="relative size-10 md:size-11 rounded-xl overflow-hidden shadow-xl ring-2 ring-white/90 bg-black/55 backdrop-blur-sm flex items-center justify-center shrink-0">
                              <span className="text-[11px] md:text-[12px] font-black text-white">
                                +{extraProducts}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* =====================================================
                          CTA — SANS ICÔNE STORE
                          ===================================================== */}
                      <div className="w-full h-8 md:h-9 rounded-[0.8rem] bg-white text-gray-900 shadow-md shadow-black/15 group-hover:bg-gray-50 group-hover:-translate-y-[1px] transition-all duration-300 flex items-center justify-center gap-1.5 font-black text-[10px] md:text-[11px] tracking-wide">
                        <span>
                          {safeLabel(
                            t("home.featuredStores.visit"),
                            "Voir la boutique"
                          )}
                        </span>

                        <ArrowRight
                          className="size-3.5 text-[#E67E22] group-hover:translate-x-1 transition-transform"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

            </div>
          );
        })}
      </div>
    </div>
  );
};