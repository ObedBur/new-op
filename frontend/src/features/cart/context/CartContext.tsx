'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { CartItem, CartState } from '../types';
import { Product } from '../../products/types/product';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { cartService } from '../services/cart.service';

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 0; // Free for now, terms discussed with seller
const CART_STORAGE_KEY = 'wapibei_cart';

const getStorageKey = (userId?: string) => userId ? `${CART_STORAGE_KEY}:${userId}` : CART_STORAGE_KEY;

const loadStoredCart = (userId?: string): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const savedCart = window.localStorage.getItem(getStorageKey(userId));
    if (!savedCart) return [];

    const parsed = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item?.product?.id && item.quantity > 0);
  } catch (error) {
    console.error('Failed to load cart from localStorage', error);
    return [];
  }
};

const saveStoredCart = (items: CartItem[], userId?: string) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage', error);
  }
};

const removeGuestCart = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
};

const isOutOfStock = (product: Product) => (
  product.availability === 'OUT_OF_STOCK' ||
  (
    product.stockQuantity !== null &&
    product.stockQuantity !== undefined &&
    product.stockQuantity === 0
  )
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const syncedUserIdRef = useRef<string | null>(null);

  // LocalStorage reste un cache rapide. Le serveur devient la source de vérité
  // dès que l'utilisateur est connecté.
  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated && syncedUserIdRef.current) return;
    saveStoredCart(items, user?.id);
  }, [items, isAuthenticated, isAuthLoading, user?.id]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !user?.id) {
      if (syncedUserIdRef.current) {
        syncedUserIdRef.current = null;
        setItems(loadStoredCart());
      }
      return;
    }

    if (syncedUserIdRef.current === user.id) return;
    syncedUserIdRef.current = user.id;

    let isMounted = true;

    const syncServerCart = async () => {
      try {
        const guestItems = loadStoredCart();
        const cachedUserItems = loadStoredCart(user.id);
        const itemsToMerge = guestItems.length > 0 ? guestItems : cachedUserItems;
        const serverItems = itemsToMerge.length > 0
          ? await cartService.mergeCart(itemsToMerge)
          : await cartService.getCart();

        if (!isMounted) return;

        setItems(serverItems);
        saveStoredCart(serverItems, user.id);
        removeGuestCart();
      } catch (error) {
        console.error('Failed to sync server cart', error);
        toast.error('Impossible de synchroniser le panier pour le moment.');
      }
    };

    syncServerCart();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthLoading, user?.id]);

  const syncItemsFromServer = (serverItems: CartItem[]) => {
    setItems(serverItems);
    saveStoredCart(serverItems, user?.id);
  };

  const addItem = (product: Product, quantity: number = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`"${product.name}" est en rupture de stock.`);
      return;
    }

    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (
        product.stockQuantity !== null &&
        product.stockQuantity !== undefined &&
        newQty > product.stockQuantity
      ) {
        toast.warning(`Stock maximum atteint pour "${product.name}" (${product.stockQuantity} dispo).`);
        return;
      }

      setItems(prev => prev.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: newQty }
          : item
      ));
      toast.success(`Quantité mise à jour pour ${product.name}`);
    } else {
      setItems(prev => [...prev, { product, quantity }]);
      toast.success(`${product.name} ajouté au panier`);
    }

    if (isAuthenticated) {
      cartService.addItem(product.id, quantity)
        .then(syncItemsFromServer)
        .catch((error) => {
          console.error('Failed to add item to server cart', error);
          toast.error('Panier non synchronisé. Réessayez.');
        });
    }
  };

  const removeItem = (productId: string) => {
    const itemToRemove = items.find(item => item.product.id === productId);
    if (itemToRemove) {
      toast.info(`${itemToRemove.product.name} retiré du panier`);
    }
    setItems(prev => prev.filter(item => item.product.id !== productId));

    if (isAuthenticated) {
      cartService.removeItem(productId)
        .then(syncItemsFromServer)
        .catch((error) => {
          console.error('Failed to remove item from server cart', error);
          toast.error('Suppression non synchronisée. Réessayez.');
        });
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const item = items.find(cartItem => cartItem.product.id === productId);
    if (!item) return;

    const nextQuantity = Math.max(1, item.quantity + delta);

    if (
      delta > 0 &&
      item.product.stockQuantity !== null &&
      item.product.stockQuantity !== undefined &&
      nextQuantity > item.product.stockQuantity
    ) {
      toast.warning(`Stock max atteint pour "${item.product.name}" (${item.product.stockQuantity} dispo).`);
      return;
    }

    setItems(prev => prev.map(cartItem =>
      cartItem.product.id === productId
        ? { ...cartItem, quantity: nextQuantity }
        : cartItem
    ));

    if (isAuthenticated) {
      cartService.setQuantity(productId, nextQuantity)
        .then(syncItemsFromServer)
        .catch((error) => {
          console.error('Failed to update server cart quantity', error);
          toast.error('Quantité non synchronisée. Réessayez.');
        });
    }
  };

  const clearCart = async () => {
    setItems([]);
    saveStoredCart([], user?.id);

    if (!isAuthenticated) return;

    try {
      await cartService.clearCart();
    } catch (error) {
      console.error('Failed to clear server cart', error);
      toast.error('Le panier serveur n’a pas pu être vidé.');
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const value = {
    items,
    totalItems,
    subtotal,
    deliveryFee: items.length > 0 ? DELIVERY_FEE : 0,
    total: items.length > 0 ? subtotal + DELIVERY_FEE : 0,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
