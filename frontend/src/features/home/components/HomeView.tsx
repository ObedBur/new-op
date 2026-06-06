"use client";

import React from "react";
import Link from "next/link";
import { Hero } from "./Hero";
import { CategoriesGrid } from "./CategoriesGrid";
import { FeaturedProductStrip } from "./FeaturedProductStrip";
import { FeaturedStores } from "./FeaturedStores";
import { HowItWorks } from "./HowItWorks";
import { LoginBanner } from "@/components/layout/LoginBanner";
import { Product, Category } from "@/features/products/types";
import { ProductQuickView } from "@/features/products/components/ProductQuickView";
import { useQuickView } from "@/features/products/hooks/useQuickView";

import { HeroSlide, HowItWorksStep } from "../services/content.service";
import { Seller } from "../services/seller.service";

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
      <div className="flex items-end justify-between mb-4">
        <div className="space-y-2">
          <div className="h-6 w-44 rounded bg-slate-200 animate-pulse" />
          <div className="h-3 w-52 rounded bg-slate-100 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {title}
        </span>
      </div>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`${title}-${index}`}
              className="min-h-[240px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
              <div className="mt-6 h-8 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-slate-400">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <main className="flex flex-col flex-1 min-h-screen bg-white">
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
              title="Offres du moment"
              subtitle="Promotions actives — prix réduits de plus de 15%"
              products={deals}
              onQuickView={openQuickView}
            />
          )}

          {showProductFallback && deals.length === 0 && (
            <ProductStripSkeleton
              title="Chargement"
              subtitle="Les sections produits se remplissent progressivement."
            />
          )}

          {/*  Nouveautés (< 7 jours) */}
          {newArrivals.length > 0 && (
            <FeaturedProductStrip
              title="Nouveautés"
              subtitle="Publiés ces 7 derniers jours"
              products={newArrivals}
              onQuickView={openQuickView}
            />
          )}

          {/*  Recommandations (basé sur historique) */}
          {recommendations.length > 0 && (
            <FeaturedProductStrip
              title="Recommandations"
              subtitle="Basé sur vos centres d'intérêt"
              products={recommendations}
              onQuickView={openQuickView}
            />
          )}

          {/*  Meilleures ventes */}
          {bestSellers.length > 0 && (
            <FeaturedProductStrip
              title="Meilleures ventes"
              subtitle="Les articles les plus commandés"
              products={bestSellers}
              onQuickView={openQuickView}
            />
          )}

          {showProductEmptyState && (
            <div className="rounded-[2rem] border border-[#DDB88C]/25 bg-[#DDB88C]/10 px-6 py-12 md:px-10 md:py-14 text-center space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Aucune vitrine produit pour le moment
              </h2>
              <p className="text-slate-600 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                Les offres, nouveautés et tendances s&apos;afficheront ici dès
                qu&apos;il y aura du contenu côté catalogue.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-[#E67E22] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#d35400]"
              >
                Voir tous les produits
              </Link>
            </div>
          )}
        </div>
      </section>

      {/*  MEILLEURES ADRESSES */}
      <div className="py-16 bg-[#DDB88C]/5">
        <FeaturedStores stores={loading.stores ? [] : stores} />
      </div>

      {/*  SERVICES & CTA */}
      <div className="bg-white">
        <HowItWorks steps={howItWorksSteps} />
      </div>

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