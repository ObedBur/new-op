"use client";

import React, { useState } from "react";
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
}) => {
  const { selectedProduct, openQuickView, closeQuickView } = useQuickView();

  return (
    <main className="flex flex-col flex-1 min-h-screen bg-white">
      {/*  HERO */}
      <Hero slides={heroSlides} />

      {/*  CATEGORIES */}
      <CategoriesGrid categories={categories} />

      {/*  GALERIES INTELLIGENTES */}
      <section className="py-10 space-y-12">
        <div className="container mx-auto px-4">

          {/*  Offres du moment (Promotions) */}
          {deals.length > 0 && (
            <div className="bg-[#DDB88C]/30 rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#DDB88C]/10">
              <FeaturedProductStrip
                title=" Offres du moment"
                subtitle="Promotions actives — prix réduits de plus de 15%"
                products={deals}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/*  Nouveautés (< 7 jours) */}
          {newArrivals.length > 0 && (
            <div className="bg-[#DDB88C]/20 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title=" Nouveautés"
                subtitle="Publiés ces 7 derniers jours"
                products={newArrivals}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/*  Recommandations (basé sur historique) */}
          {recommendations.length > 0 && (
            <div className="bg-[#DDB88C]/15 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title=" Recommandations"
                subtitle="Basé sur vos centres d'intérêt"
                products={recommendations}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/*  Meilleures ventes */}
          {bestSellers.length > 0 && (
            <div className="bg-[#DDB88C]/10 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title=" Meilleures ventes"
                subtitle="Les articles les plus commandés"
                products={bestSellers}
                onQuickView={openQuickView}
              />
            </div>
          )}
        </div>
      </section>

      {/*  MEILLEURES ADRESSES */}
      <div className="py-16 bg-[#DDB88C]/5">
        <FeaturedStores stores={stores} />
      </div>

      {/*  SERVICES & CTA */}
      <div className="bg-white">
        <HowItWorks />
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