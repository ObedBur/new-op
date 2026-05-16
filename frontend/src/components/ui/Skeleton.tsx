
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

/**
 * Composant Skeleton pour un chargement visuellement doux.
 * Utilise un gris chaud avec une animation pulse lente et fluide.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rectangular' }) => {
  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-3xl aspect-square',
  };

  return (
    <div className={cn('skeleton', variants[variant], className)} />
  );
};

/**
 * Skeleton pour une carte produit complète.
 * Reproduit exactement la structure premium du ProductCard.
 */
export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden premium-shadow">
    {/* Zone image avec dégradé simulé */}
    <div className="relative aspect-square w-full bg-gray-100 dark:bg-white/5 overflow-hidden">
      <Skeleton variant="card" className="w-full h-full rounded-none" />
      {/* Simulation du badge stock */}
      <div className="absolute top-2 left-2">
        <Skeleton className="h-4 w-14 rounded-lg" />
      </div>
    </div>

    {/* Zone contenu */}
    <div className="p-2.5 md:p-3 flex flex-col gap-2">
      {/* Ligne : icône catégorie + prix */}
      <div className="flex items-center justify-between gap-1">
        <Skeleton className="size-3 rounded-sm opacity-50" />
        <Skeleton variant="text" className="h-4 w-20 ml-auto" />
      </div>
      {/* Titre */}
      <Skeleton variant="text" className="h-3 w-full" />
      <Skeleton variant="text" className="h-3 w-2/3" />
      {/* Pied : date + étoile */}
      <div className="flex items-center justify-between pt-1.5 border-t border-black/5 dark:border-white/5 mt-auto">
        <Skeleton variant="text" className="h-2.5 w-14" />
        <Skeleton variant="text" className="h-2.5 w-8" />
      </div>
    </div>
  </div>
);
