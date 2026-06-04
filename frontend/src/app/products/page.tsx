import { Suspense } from 'react';
import {
  getProducts,
  getCategories,
  getDeals,
  getNewArrivals,
  getRecommendations,
  getBestSellers
} from '@/features/products/services/product.service';
import { ProductsView } from '@/features/products/components/ProductsView';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoryId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search;
  const categoryId = resolvedSearchParams.categoryId ? parseInt(resolvedSearchParams.categoryId) : undefined;

  // Parallel fetching in Server Component
  const [productsRes, categoriesRes, dealsRes, newArrivalsRes, recommendationsRes, bestSellersRes] = await Promise.all([
    getProducts({ search, categoryId }),
    getCategories(),
    getDeals(12),
    getNewArrivals(12),
    getRecommendations(undefined, 12),
    getBestSellers(12)
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];
  const deals = dealsRes.success ? dealsRes.data : [];
  const newArrivals = newArrivalsRes.success ? newArrivalsRes.data : [];
  const recommendations = recommendationsRes.success ? recommendationsRes.data : [];
  const bestSellers = bestSellersRes.success ? bestSellersRes.data : [];

  return (
    <main className="min-h-screen pt-20">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      }>
        <ProductsView
          initialProducts={products}
          categories={categories}
          deals={search ? [] : deals}
          newArrivals={search ? [] : newArrivals}
          recommendations={search ? [] : recommendations}
          bestSellers={search ? [] : bestSellers}
          searchTerm={search}
        />
      </Suspense>
    </main>
  );
}
