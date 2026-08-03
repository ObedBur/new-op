"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Seller } from "../services/seller.service";
import { useT } from "@/i18n/useT";

interface FeaturedStoresProps {
  stores: Seller[];
}

export const FeaturedStores: React.FC<FeaturedStoresProps> = ({ stores }) => {
  const { t } = useT();
  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto max-w-7xl px-4 py-12">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-10 border-b border-gray-100 dark:border-white/5 pb-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
            {t('home.featuredStores.pretitle')}
          </span>
          <h3 className="text-3xl md:text-4xl font-black text-deep-blue dark:text-white tracking-tighter">
            {t('home.featuredStores.title')}
          </h3>
        </div>
        <Link
          href="/sellers"
          className="group flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary transition-all"
        >
          {t('home.featuredStores.exploreAll')}
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {stores.map((store) => (
          <div
            key={store.id}
            className="group bg-white dark:bg-[#1a1a1a] rounded-[2rem] sm:rounded-4xl border border-gray-100 dark:border-white/10 p-3 sm:p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
          >
            {/* 1. Header: Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mb-3 sm:mb-5 text-center sm:text-left">
              <div className="relative size-12 sm:size-14 rounded-full p-0.5 bg-linear-to-tr from-primary to-orange-200 shadow-lg shrink-0">
                <Image
                  src={store.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.boutiqueName || 'V')}&background=E67E22&color=fff&size=56`}
                  alt={store.boutiqueName}
                  fill
                  sizes="56px"
                  className="rounded-full object-cover border-2 border-white dark:border-[#1a1a1a]"
                />
              </div>
              <div className="flex-1 w-full min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-0.5">
                  <h4 className="text-[12px] sm:text-[15px] font-black text-deep-blue dark:text-white line-clamp-1 truncate uppercase tracking-tight">
                    {store.boutiqueName}
                  </h4>
                  {store.isVerified && (
                    <div className="shrink-0 flex items-center">
                      <span
                        className="material-symbols-outlined text-blue-500 text-[14px] sm:text-[18px] font-bold select-none"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-orange-400">
                    <span
                      className="material-symbols-outlined text-[12px] font-black"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    {store.trustScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Showcase Gallery — Only if seller has product previews */}
            {store.productPreviews.length > 0 && (
              <div className={store.productPreviews.length === 1 ? "grid grid-cols-1 gap-1.5 sm:gap-2 h-28 sm:h-44 mb-4 sm:mb-5" : "grid grid-cols-2 gap-1.5 sm:gap-2 h-28 sm:h-44 mb-4 sm:mb-5"}>
                {/* Large Image (Left) */}
                <div className={store.productPreviews.length === 1 ? "relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 col-span-1" : "relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 row-span-2"}>
                  {store.productPreviews[0] && (
                    <Image
                      src={store.productPreviews[0]}
                      alt={`${store.boutiqueName} preview 1`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </div>

                {/* Second Image (Right, if exists) */}
                {store.productPreviews.length >= 2 && (
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5">
                    <Image
                      src={store.productPreviews[1]}
                      alt={`${store.boutiqueName} preview 2`}
                      fill
                      sizes="(max-width: 768px) 25vw, (max-width: 1024px) 12vw, 10vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}

                {/* Third Image (Right bottom, if exists) */}
                {store.productPreviews.length >= 3 && (
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5">
                    <Image
                      src={store.productPreviews[2]}
                      alt={`${store.boutiqueName} preview 3`}
                      fill
                      sizes="(max-width: 768px) 25vw, (max-width: 1024px) 12vw, 10vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. Footer Info & Action */}
            <div className="mt-auto">
              <Link href={`/sellers/${store.id}`} className="block">
                <Button
                  variant="outline"
                  className="w-full py-2.5 sm:py-4 text-[10px] sm:text-sm border-gray-100 dark:border-white/10 text-deep-blue dark:text-white hover:border-primary rounded-xl sm:rounded-2xl"
                >
                  {t('home.featuredStores.visit')}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
