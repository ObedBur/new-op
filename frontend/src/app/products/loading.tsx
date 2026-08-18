import { ProductCardSkeleton } from '@/features/products/components/ProductCardSkeleton';

export default function ProductsLoading() {
  return (
    <main className="min-h-screen pt-2 pb-10">
      <section className="pt-4 pb-10 container mx-auto max-w-7xl px-3 sm:px-4">
        {/* Section header skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 rounded-full bg-[#E67E22]/30" />
            <span className="h-5 w-28 rounded-md bg-[#E67E22]/10 animate-pulse" />
          </div>
          <div className="h-9 w-52 md:w-72 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
          <div className="h-4 w-64 md:w-80 rounded-md bg-slate-100 dark:bg-white/5 animate-pulse mt-2" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start">
          {/* Sidebar skeleton */}
          <div className="hidden md:flex flex-col w-full md:w-56 lg:w-64 shrink-0 gap-8">
            <div className="space-y-2">
              <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-white/10 animate-pulse" />
              <div className="h-3 w-32 rounded-md bg-slate-100 dark:bg-white/5 animate-pulse" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2 content-center">
                <div
                  className="h-4 rounded-md bg-slate-100 dark:bg-white/5 animate-pulse"
                  style={{ width: `${72 + ((i * 9) % 24)}%` }}
                />
              </div>
            ))}
            <div className="h-6 w-28 rounded-md bg-slate-200 dark:bg-white/10 animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 rounded-md bg-slate-100 dark:bg-white/5 animate-pulse"
                  style={{ width: `${58 + ((i * 11) % 28)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="h-5 w-32 rounded-md bg-slate-200 dark:bg-white/10 animate-pulse" />
              <div className="h-9 w-40 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <div className="h-10 w-52 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}