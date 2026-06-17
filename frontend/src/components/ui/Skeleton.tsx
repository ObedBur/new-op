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

export { ProductCardSkeleton } from './SkeletonLoaders';
