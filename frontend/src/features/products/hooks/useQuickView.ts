'use client';

import { useState, useCallback } from 'react';
import { Product } from '../types';

export function useQuickView() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return {
    selectedProduct,
    openQuickView,
    closeQuickView,
  };
}
