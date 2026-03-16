import { Suspense } from 'react';
import { getProducts, getCategories } from '@/features/products/services/product.service';
import { ProductsView } from '@/features/products/components/ProductsView';

// Metadata for SEO
export const metadata = {
  title: 'Nos Articles | Marketplace Africain',
  description: 'Découvrez les meilleurs deals et produits locaux en Afrique. Alimentation, High-Tech, Mode et plus.',
};

export default async function ProductsPage() {
  // Parallel fetching in Server Component
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts(),
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
        />
      </Suspense>
    </main>
  );
}
