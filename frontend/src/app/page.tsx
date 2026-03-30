"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HomeView } from "@/features/home/components/HomeView";
import {
  getProducts,
  getCategories,
  getDeals,
  getNewArrivals,
  getRecommendations,
  getBestSellers,
} from "@/features/products/services/product.service";
import {
  getActiveSellers,
  Seller,
} from "@/features/home/services/seller.service";
import {
  getHomepageContent,
  HeroSlide,
  HowItWorksStep,
} from "@/features/home/services/content.service";
import { Product, Category } from "@/types";

export default function Home() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [stores, setStores] = useState<Seller[]>([]);
  const [howItWorksSteps, setHowItWorksSteps] = useState<HowItWorksStep[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, sellersRes, contentRes, dealsRes, newArrivalsRes, recommendationsRes, bestSellersRes] =
          await Promise.all([
            getCategories(),
            getActiveSellers(),
            getHomepageContent(),
            getDeals(12),
            getNewArrivals(12),
            getRecommendations(user?.id, 12),
            getBestSellers(12),
          ]);

        if (categoriesRes.success) setCategories(categoriesRes.data);

        setStores(sellersRes);
        setHeroSlides(contentRes.heroSlides);
        setHowItWorksSteps(contentRes.howItWorksSteps);

        if (dealsRes.success) setDeals(dealsRes.data);
        if (newArrivalsRes.success) setNewArrivals(newArrivalsRes.data);
        if (recommendationsRes.success) setRecommendations(recommendationsRes.data);
        if (bestSellersRes.success) setBestSellers(bestSellersRes.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  // Don't render Home content for admins to prevent flash
  if (isAuthenticated && user?.role === "ADMIN") {
    return null;
  }

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
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
    />
  );
}
