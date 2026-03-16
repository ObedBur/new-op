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
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  stores: Seller[];
  howItWorksSteps: HowItWorksStep[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  products = [],
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

      {/* 3. SECTION PRODUITS - Cadres avec transparence #DDB88C */}
      <section className="py-10 space-y-12">
        <div className="container mx-auto px-4">

          {/* Cadre 1: Offres du moment - Transparence 30% */}
          <div className="bg-[#DDB88C]/30 rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#DDB88C]/10">
            <FeaturedProductStrip
              title="Offres du moment"
              subtitle="Les meilleures offres en Afrique aujourd'hui"
              products={products.slice(0, 6)}
              onQuickView={openQuickView}
            />
          </div>

          {/* Cadre 2: Nouveautés - Transparence 20% (plus léger) */}
          <div className="bg-[#DDB88C]/20 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
            <FeaturedProductStrip
              title="Nouveautés"
              subtitle="Les derniers arrivages en ville"
              products={products.slice(6, 12)}
              onQuickView={openQuickView}
            />
          </div>

          {/* Cadre 3: Recommandations - Transparence 15% */}
          {products.length > 12 && (
            <div className="bg-[#DDB88C]/15 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="Recommandations"
                subtitle="Basé sur vos recherches récentes"
                products={products.slice(12, 18)}
                onQuickView={openQuickView}
              />
            </div>
          )}

          {/* Cadre 4: Meilleures ventes - Transparence 10% */}
          {products.length > 18 && (
            <div className="bg-[#DDB88C]/10 rounded-[2rem] p-6 md:p-10 shadow-sm mt-12 border border-[#DDB88C]/5">
              <FeaturedProductStrip
                title="Meilleures ventes"
                subtitle="Ce que tout le monde s'arrache en ce moment"
                products={products.slice(18, 24)}
                onQuickView={openQuickView}
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. MEILLEURES ADRESSES - Fond très léger pour le rappel de couleur */}
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