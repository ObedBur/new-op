"use client";

import React, { useState, useEffect } from "react";
import { Hero } from "./Hero";
import { CategoriesGrid } from "./CategoriesGrid";
import { FeaturedProductStrip } from "./FeaturedProductStrip";
import { FeaturedStores } from "./FeaturedStores";
import { HowItWorks } from "./HowItWorks";
import { BecomeSeller } from "./BecomeSeller";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex flex-col flex-1 min-h-screen bg-white">
      {/* 1. HERO */}
      <Hero slides={heroSlides} />

      {/* 2. CATEGORIES */}
      <CategoriesGrid categories={categories} />

      {/* 3. GALERIES INTELLIGENTES */}
      <section className="py-10 space-y-12">
        <div className="container mx-auto px-4">

          {/* Galerie 1: Offres du moment (Promotions) */}
          {deals.length > 0 && (
            <div className="bg-[#DDB88C]/30 rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#DDB88C]/10">
              <FeaturedProductStrip
                title="🔥 Offres du moment"
                subtitle="Promotions actives — prix réduits de plus de 15%"
                products={deals}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/* Galerie 2: Nouveautés (< 7 jours) */}
          {newArrivals.length > 0 && (
            <div className="bg-[#DDB88C]/20 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="✨ Nouveautés"
                subtitle="Publiés ces 7 derniers jours"
                products={newArrivals}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/* Galerie 3: Recommandations (basé sur historique) */}
          {recommendations.length > 0 && (
            <div className="bg-[#DDB88C]/15 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="💡 Recommandations"
                subtitle="Basé sur vos centres d'intérêt"
                products={recommendations}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/* Galerie 4: Meilleures ventes */}
          {bestSellers.length > 0 && (
            <div className="bg-[#DDB88C]/10 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="🏆 Meilleures ventes"
                subtitle="Les articles les plus commandés"
                products={bestSellers}
                onQuickView={openQuickView}
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. MEILLEURES ADRESSES */}
      <div className="py-16 bg-[#DDB88C]/5">
        <FeaturedStores stores={stores} />
      </div>

      {/* 5. SERVICES & CTA */}
      <div className="bg-white">
        <HowItWorks />
        <div className="pb-12 px-4">
          <BecomeSeller />
        </div>
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