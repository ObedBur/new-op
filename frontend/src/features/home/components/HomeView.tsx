"use client";

import React from "react";
import Link from "next/link";
import { Hero } from "./Hero";
import { CategoriesGrid } from "./CategoriesGrid";
import { FeaturedProductStrip } from "./FeaturedProductStrip";
import { FeaturedStores } from "./FeaturedStores";
import { HowItWorks } from "./HowItWorks";
import { WhyChooseUs } from "./WhyChooseUs";
import { Testimonials } from "./Testimonials";
import { Newsletter } from "./Newsletter";
import { LoginBanner } from "@/components/layout/LoginBanner";
import { Product, Category } from "@/features/products/types";
import { ProductQuickView } from "@/features/products/components/ProductQuickView";
import { useQuickView } from "@/features/products/hooks/useQuickView";

import { HeroSlide, HowItWorksStep } from "../services/content.service";
import { Seller } from "../services/seller.service";
import { useT } from "@/i18n/useT";

interface HomeViewProps {
  deals: Product[];
  newArrivals: Product[];
  recommendations: Product[];
  bestSellers: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  stores: Seller[];
  howItWorksSteps: HowItWorksStep[];
  loading: {
    categories: boolean;
    content: boolean;
    stores: boolean;
    deals: boolean;
    newArrivals: boolean;
    recommendations: boolean;
    bestSellers: boolean;
  };
}

export const HomeView: React.FC<HomeViewProps> = ({
  deals = [],
  newArrivals = [],
  recommendations = [],
  bestSellers = [],
  categories = [],
  heroSlides = [],
  stores = [],
  howItWorksSteps = [],
  loading,
}) => {
  const { selectedProduct, openQuickView, closeQuickView } = useQuickView();
  const { t } = useT();
  const showProductFallback =
    loading.deals ||
    loading.newArrivals ||
    loading.recommendations ||
    loading.bestSellers;

  const productsLoaded =
    !loading.deals &&
    !loading.newArrivals &&
    !loading.recommendations &&
    !loading.bestSellers;

  const hasAnyProductSection =
    deals.length > 0 ||
    newArrivals.length > 0 ||
    recommendations.length > 0 ||
    bestSellers.length > 0;

  const showProductEmptyState = productsLoaded && !hasAnyProductSection;

  const ProductStripSkeleton = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div className="space-y-2">
          <div className="h-6 w-44 rounded-xl bg-slate-200 dark:bg-white/8 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
          </div>
          <div className="h-3 w-56 rounded-lg bg-slate-100 dark:bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_200ms] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-white/20">
          {title}
        </span>
      </div>

      {/* Cards grid : 2 cols mobile → 3 tablet → 4 md → 6 lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`${title}-${i}`}
            className="rounded-2xl border border-slate-100 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-4 shadow-sm"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Image placeholder */}
            <div className="relative w-full aspect-square rounded-xl bg-slate-100 dark:bg-white/[0.06] overflow-hidden mb-4">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/8 to-transparent" />
            </div>
            {/* Title */}
            <div className="relative h-4 w-3/4 rounded-lg bg-slate-100 dark:bg-white/[0.06] overflow-hidden mb-2">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_100ms] bg-gradient-to-r from-transparent via-white/50 dark:via-white/8 to-transparent" />
            </div>
            {/* Subtitle */}
            <div className="relative h-3 w-1/2 rounded-md bg-slate-100 dark:bg-white/[0.04] overflow-hidden mb-5">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_200ms] bg-gradient-to-r from-transparent via-white/50 dark:via-white/8 to-transparent" />
            </div>
            {/* Button */}
            <div className="relative h-9 w-full rounded-xl bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite_300ms] bg-gradient-to-r from-transparent via-white/50 dark:via-white/8 to-transparent" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-300 dark:text-white/20">{subtitle}</p>
    </div>
  );


  return (
    <main className="flex flex-col flex-1 min-h-screen bg-white dark:bg-black">
      {/*  HERO */}
      <Hero slides={heroSlides} />

      {/*  CATEGORIES */}
      <CategoriesGrid categories={categories} isLoading={loading.categories} />

      {/*  GALERIES INTELLIGENTES */}
      <section className="py-10 space-y-12">
        <div className="container mx-auto px-4">

          {/*  Offres du moment (Promotions) */}
          {deals.length > 0 && (
            <FeaturedProductStrip
              title={t("home.homeView.dealsTitle")}
              subtitle={t("home.homeView.dealsSubtitle")}
              products={deals}
              onQuickView={openQuickView}
            />
          )}

          {showProductFallback && deals.length === 0 && (
            <ProductStripSkeleton
              title={t("home.homeView.loadingTitle")}
              subtitle={t("home.homeView.loadingSubtitle")}
            />
          )}

          {/*  Nouveautés (< 7 jours) */}
          {newArrivals.length > 0 && (
            <FeaturedProductStrip
              title={t("home.homeView.newTitle")}
              subtitle={t("home.homeView.newSubtitle")}
              products={newArrivals}
              onQuickView={openQuickView}
            />
          )}

          {/*  Recommandations (basé sur historique) */}
          {recommendations.length > 0 && (
            <FeaturedProductStrip
              title={t("home.homeView.recTitle")}
              subtitle={t("home.homeView.recSubtitle")}
              products={recommendations}
              onQuickView={openQuickView}
            />
          )}

          {/*  Meilleures ventes */}
          {bestSellers.length > 0 && (
            <FeaturedProductStrip
              title={t("home.homeView.bestTitle")}
              subtitle={t("home.homeView.bestSubtitle")}
              products={bestSellers}
              onQuickView={openQuickView}
            />
          )}

          {showProductEmptyState && (
            <div className="rounded-[2rem] border border-[#DDB88C]/25 bg-[#DDB88C]/10 px-6 py-12 md:px-10 md:py-14 text-center space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("home.homeView.emptyTitle")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                {t("home.homeView.emptyDesc")}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-[#E67E22] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#d35400]"
              >
                {t("home.homeView.viewAllProducts")}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/*  MEILLEURES ADRESSES */}
      <div className="py-16 bg-[#DDB88C]/5 dark:bg-[#DDB88C]/10">
        <FeaturedStores stores={loading.stores ? [] : stores} />
      </div>

      {/*  SERVICES & CTA */}
      <div className="bg-white dark:bg-black">
        <HowItWorks steps={howItWorksSteps} />
      </div>

      {/* POURQUOI NOUS CHOISIR */}
      <WhyChooseUs />

      {/* AVIS CLIENTS */}
      <Testimonials />

      {/* NEWSLETTER */}
      <Newsletter />

      <LoginBanner />

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={closeQuickView}
        />
      )}
    </main>
  );
};