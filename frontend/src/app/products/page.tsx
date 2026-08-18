import { Suspense } from 'react';
import { getProducts, getCategories } from '@/features/products/services/product.service';
import { ProductsView } from '@/features/products/components/ProductsView';
import { ProductGridSkeleton, CategoryGridSkeleton } from '@/components/ui/SkeletonLoaders';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // Parallel fetching in Server Component
  // On charge tout le catalogue (sans filtre) pour que le filtrage côté client
  // soit exact : compteurs de catégories, recherche, tri et pagination portent
  // sur l'ensemble des produits, pas sur un sous-ensemble de 50.
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({ limit: 1000 }),
    getCategories()
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <main className="min-h-screen pt-2">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Categories Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
            <CategoryGridSkeleton count={5} />
          </div>

          {/* Products Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-md animate-pulse" />
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      }>
        <ProductsView
          initialProducts={products}
          categories={categories}
        />
      </Suspense>
    </main>
  );
}

