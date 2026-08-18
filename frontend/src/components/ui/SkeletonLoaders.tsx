 /**
 * Collection de Skeleton Loaders réutilisables
 * Simulent le contenu qui charge pour une meilleure UX
 */

export const ProductCardSkeleton = () => (
  <div className="w-full bg-white dark:bg-[#1a1a1a] rounded-[1.75rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm animate-pulse flex flex-col">
    {/* Aspect ratio block for the image equivalent (aspect-[4/5] on mobile, taller on desktop) */}
    <div className="w-full aspect-[4/5] sm:aspect-square bg-slate-200 dark:bg-white/10 relative p-4 flex flex-col justify-between">

      {/* Top Badges Skeleton */}
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-white/20" />
        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-white/20" />
      </div>

      {/* Bottom content overlaid on image in original card */}
      <div className="mt-auto space-y-2">
        {/* Title and price lines */}
        <div className="w-3/4 h-5 rounded-md bg-slate-300 dark:bg-white/20" />
        <div className="w-1/2 h-5 rounded-md bg-slate-300 dark:bg-white/20" />

        {/* Store info line */}
        <div className="w-1/3 h-4 rounded-md bg-slate-300 dark:bg-white/20 mt-2" />
      </div>
    </div>

    {/* Button section (typically absolute at bottom or flex-end) */}
    <div className="p-3 bg-white dark:bg-[#1a1a1a]">
      <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-white/10" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export const CategorySkeleton = () => (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 animate-pulse">
        {/* Category icon/image */}
        <div className="w-full h-24 bg-gray-200 dark:bg-white/10 rounded-xl mb-4" />

        {/* Category name */}
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-md w-3/4 mb-3" />

        {/* Count */}
        <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-md w-1/2" />
    </div>
);

export const CategoryGridSkeleton = ({ count = 5 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <CategorySkeleton key={i} />
        ))}
    </div>
);

export const ProfileSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Profile header */}
        <div className="flex items-center gap-6 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
            {/* Avatar */}
            <div className="size-20 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />

            {/* User info */}
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-md w-1/3" />
                <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-md w-1/2" />
                <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-md w-2/3" />
            </div>
        </div>

        {/* Content sections */}
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 space-y-4">
                {/* Section title */}
                <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-md w-1/4" />

                {/* Content lines */}
                {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                        <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-md w-full" />
                        <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-md w-5/6" />
                    </div>
                ))}
            </div>
        ))}
    </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="animate-pulse space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                {Array.from({ length: cols }).map((_, j) => (
                    <div key={j} className="flex-1 h-6 bg-gray-200 dark:bg-white/10 rounded-md" />
                ))}
            </div>
        ))}
    </div>
);

export const ListSkeleton = ({ count = 5 }) => (
    <div className="space-y-3 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                {/* Avatar */}
                <div className="size-12 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-md w-1/3" />
                    <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-md w-1/2" />
                </div>

                {/* Action */}
                <div className="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded-md" />
            </div>
        ))}
    </div>
);

export const CardSkeleton = ({ lines = 4 }) => (
    <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 space-y-4 animate-pulse">
        {/* Header */}
        <div className="h-6 bg-gray-200 dark:bg-white/10 rounded-md w-1/3" />

        {/* Content lines */}
        {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-md w-full" />
                <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-md w-5/6" />
            </div>
        ))}
    </div>
);

export const HeroSkeleton = () => (
    <div className="w-full h-80 md:h-[500px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/10 dark:via-white/5 dark:to-white/10 rounded-2xl animate-pulse" />
);

export const spinnerOverlay = () => (
    <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-white/10 border-t-orange-500" />
    </div>
);
