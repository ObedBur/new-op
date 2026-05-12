"use client";
<<<<<<< HEAD

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { HomeView } from "@/features/home/components/HomeView";
import {
  getCategories,
  getDeals,
  getNewArrivals,
  getRecommendations,
  getBestSellers,
} from "@/features/products/services/product.service";
import {
  getActiveSellers,
  HomeSeller,
} from "@/features/home/services/seller.service";
import {
  getHomepageContent,
} from "@/features/home/services/content.service";
import { Product, Category } from "@/types";

type HomeSectionKey =
  | "categories"
  | "content"
  | "stores"
  | "deals"
  | "newArrivals"
  | "recommendations"
  | "bestSellers";

type HomeLoadingState = Record<HomeSectionKey, boolean>;

export default function Home() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { setAppReady } = useLoading();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<Awaited<ReturnType<typeof getHomepageContent>>["heroSlides"]>([]);
  const [stores, setStores] = useState<HomeSeller[]>([]);
  const [howItWorksSteps, setHowItWorksSteps] = useState<Awaited<ReturnType<typeof getHomepageContent>>["howItWorksSteps"]>([]);
  const [sectionLoading, setSectionLoading] = useState<HomeLoadingState>({
    categories: true,
    content: true,
    stores: true,
    deals: true,
    newArrivals: true,
    recommendations: true,
    bestSellers: true,
  });

  const setSectionLoaded = (key: HomeSectionKey) => {
    setSectionLoading((prev) => ({ ...prev, [key]: false }));
  };

  // Galeries intelligentes
  const [deals, setDeals] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  // Redirect ADMIN users away from Home to Admin Dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    setSectionLoading({
      categories: true,
      content: true,
      stores: true,
      deals: true,
      newArrivals: true,
      recommendations: true,
      bestSellers: true,
    });

    void getCategories()
      .then((response) => {
        if (response.success) {
          setCategories(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => setSectionLoaded("categories"));

    void getActiveSellers()
      .then((response) => {
        setStores(response);
      })
      .catch((error) => {
        console.error("Error fetching sellers:", error);
      })
      .finally(() => setSectionLoaded("stores"));

    void getHomepageContent()
      .then((response) => {
        setHeroSlides(response.heroSlides);
        setHowItWorksSteps(response.howItWorksSteps);
      })
      .catch((error) => {
        console.error("Error fetching homepage content:", error);
      })
      .finally(() => setSectionLoaded("content"));

    void getDeals(12)
      .then((response) => {
        if (response.success) {
          setDeals(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching deals:", error);
      })
      .finally(() => setSectionLoaded("deals"));

    void getNewArrivals(12)
      .then((response) => {
        if (response.success) {
          setNewArrivals(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching new arrivals:", error);
      })
      .finally(() => setSectionLoaded("newArrivals"));

    void getRecommendations(user?.id, 12)
      .then((response) => {
        if (response.success) {
          setRecommendations(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
      })
      .finally(() => setSectionLoaded("recommendations"));

    void getBestSellers(12)
      .then((response) => {
        if (response.success) {
          setBestSellers(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching best sellers:", error);
      })
      .finally(() => setSectionLoaded("bestSellers"));
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading) {
      setAppReady(true);
    }
  }, [authLoading, setAppReady]);

  // Don't render Home content for admins to prevent flash
  if (isAuthenticated && user?.role === "ADMIN") {
    return null;
  }

  if (authLoading) {
    return null;
  }

  return (
    <HomeView
      deals={deals}
      newArrivals={newArrivals}
      recommendations={recommendations}
      bestSellers={bestSellers}
      categories={categories}
      heroSlides={heroSlides}
      stores={stores}
      howItWorksSteps={howItWorksSteps}
      loading={sectionLoading}
    />
  );
}
=======
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Process from "../components/landing/Process";
import ServiceExplorer from "../components/landing/ServiceExplorer";
import Footer from "../components/landing/Footer";
import { Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect ADMIN away from landing page
  useEffect(() => {
    if (!isLoading && user?.role === 'ADMIN') {
      router.replace('/admin/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <main className="bg-off-white min-h-screen text-chocolat font-sans selection:bg-ocre/20 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col"
        >
          <Navbar />

          <Hero />

          <ServiceExplorer />

          <Process />

          {/* Arcture Final CTA Section */}
          <section className="py-48 px-4 min-[480px]:px-8 min-[1440px]:px-12 bg-off-white">
            <div className="arcture-container bg-chocolat rounded-sm p-16 md:p-32 lg:p-40 text-center text-white overflow-hidden relative shadow-[0_30px_100px_rgba(50,27,19,0.15)]">
              <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-ocre/20 rounded-full blur-[160px] opacity-40"></div>
              <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-ocre/10 rounded-full blur-[160px] opacity-40"></div>

              <div className="relative z-10">
                <span className="text-ocre font-bold tracking-[0.4em] text-[10px] uppercase mb-12 block">Prêt à commencer?</span>
                <h2 className="text-off-white mb-20 max-w-5xl mx-auto leading-none uppercase">
                  REDÉFINISSEZ <br /> <span className="text-ocre italic lowercase serif">votre quotidien.</span>
                </h2>
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-10">
                  <Link href="/devenir-prestataire" className="w-full md:w-auto">
                    <button className="btn-arcture py-6 px-16 bg-white text-chocolat hover:bg-ocre hover:text-chocolat w-full">
                      DEVENIR PRESTATAIRE
                    </button>
                  </Link>
                  <button className="flex items-center justify-center gap-4 bg-transparent border border-ocre/30 text-ocre px-12 py-6 rounded-md font-bold hover:bg-ocre/10 transition-all uppercase tracking-[0.2em] text-[11px] w-full md:w-auto group">
                    <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    NOUS CONTACTER
                  </button>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
