"use client";

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

const HOME_INITIAL_LOADING: HomeLoadingState = {
  categories: true,
  content: true,
  stores: true,
  deals: true,
  newArrivals: true,
  recommendations: true,
  bestSellers: true,
};

export default function Home() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { setAppReady } = useLoading();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<Awaited<ReturnType<typeof getHomepageContent>>["heroSlides"]>([]);
  const [stores, setStores] = useState<HomeSeller[]>([]);
  const [howItWorksSteps, setHowItWorksSteps] = useState<Awaited<ReturnType<typeof getHomepageContent>>["howItWorksSteps"]>([]);
  const [sectionLoading, setSectionLoading] = useState<HomeLoadingState>(HOME_INITIAL_LOADING);

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
    setSectionLoading(HOME_INITIAL_LOADING);

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
    return (
      <HomeView
        deals={[]}
        newArrivals={[]}
        recommendations={[]}
        bestSellers={[]}
        categories={[]}
        heroSlides={[]}
        stores={[]}
        howItWorksSteps={[]}
        loading={HOME_INITIAL_LOADING}
      />
    );
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
