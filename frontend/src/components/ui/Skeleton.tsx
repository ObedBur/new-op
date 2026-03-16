
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
 * Reproduit la structure du ProductCard pour un chargement cohérent.
 */
export const ProductCardSkeleton: React.FC = () => (
  <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden">
    {/* Image placeholder */}
    <Skeleton variant="card" className="w-full rounded-none" />
    
    {/* Content */}
    <div className="p-3 flex flex-col gap-2">
      {/* Price */}
      <Skeleton variant="text" className="h-5 w-20" />
      {/* Title */}
      <Skeleton variant="text" className="h-3 w-full" />
      <Skeleton variant="text" className="h-3 w-3/4" />
      {/* Footer */}
      <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50 dark:border-white/5">
        <Skeleton variant="text" className="h-3 w-16" />
        <Skeleton variant="text" className="h-3 w-10" />
      </div>
    </div>
  </div>
);
