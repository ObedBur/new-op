import { Suspense } from 'react';
import {
  getProducts,
  getCategories
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
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({ search, categoryId }),
    getCategories()
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

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
          searchTerm={search}
        />
      </Suspense>
    </main>
  );
}
