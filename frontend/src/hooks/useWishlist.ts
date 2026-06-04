'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product.types';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load wishlist on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('wapibei_wishlist');
        setWishlist(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error("Failed to load wishlist", e);
      }
    };

    loadWishlist();

    // Listen for changes from other components/pages
    window.addEventListener('wishlist-update', loadWishlist);
    return () => {
      window.removeEventListener('wishlist-update', loadWishlist);
    };
  }, []);

  const toggleFavorite = (product: Product) => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('wapibei_wishlist');
      let currentList: Product[] = stored ? JSON.parse(stored) : [];
      
      const isAlreadyFav = currentList.some((item) => String(item.id) === String(product.id));
      let action = 'added';
      
      if (isAlreadyFav) {
        currentList = currentList.filter((item) => String(item.id) !== String(product.id));
        action = 'removed';
      } else {
        currentList.push(product);
      }

      localStorage.setItem('wapibei_wishlist', JSON.stringify(currentList));
      setWishlist(currentList);

      // Dispatch event to notify other components/hooks using useWishlist
      window.dispatchEvent(new Event('wishlist-update'));
      return action;
    } catch (e) {
      console.error("Failed to toggle favorite", e);
      return null;
    }
  };

  const isFavorited = (productId: string | number) => {
    return wishlist.some((item) => String(item.id) === String(productId));
  };

  return {
    wishlist,
    toggleFavorite,
    isFavorited,
    count: wishlist.length,
  };
}
