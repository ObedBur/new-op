
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, CartState } from '../types';
import { Product } from '../../products/types/product';
import { toast } from 'sonner';

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 0; // Free for now, terms discussed with seller

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('wapibei_cart');
      if (savedCart) {
        try {
          // eslint-disable-next-line
        setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('wapibei_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        toast.success(`Quantité mise à jour pour ${product.name}`);
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success(`${product.name} ajouté au panier`);
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    const itemToRemove = items.find(item => item.product.id === productId);
    if (itemToRemove) {
      toast.info(`${itemToRemove.product.name} retiré du panier`);
    }
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
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
