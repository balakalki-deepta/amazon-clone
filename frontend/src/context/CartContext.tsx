/**
 * Client-side cart state, persisted to localStorage.
 *
 * Quantities are capped at what's actually available: a product's stock, and a
 * hard ceiling (MAX_CART_QUANTITY) that matches the backend's per-line limit.
 * This is where Amazon enforces quantity limits too — at the cart's quantity
 * selector — so the user never reaches checkout with an impossible order.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../types';
import { maxQuantityFor } from './cartQuantity';

export interface CartItem {
  productId: number;
  slug: string;
  title: string;
  price: number;
  thumbnailUrl: string | null;
  stock: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'amazon-clone-cart';

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  // Persist on every change so the cart survives refreshes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product: Product, quantity = 1) {
    const cap = maxQuantityFor(product.stock);
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                stock: product.stock, // refresh the stock snapshot
                quantity: Math.min(item.quantity + quantity, cap),
              }
            : item,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          thumbnailUrl: product.thumbnailUrl,
          stock: product.stock,
          quantity: Math.min(quantity, cap),
        },
      ];
    });
  }

  /** Set an item's quantity; clamps to [1, max] or removes it at 0 or less. */
  function updateQuantity(productId: number, quantity: number) {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.productId !== productId);
      }
      return current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, maxQuantityFor(item.stock)) }
          : item,
      );
    });
  }

  function removeItem(productId: number) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  /** Empty the cart (called after a successful order placement). */
  function clearCart() {
    setItems([]);
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalQuantity, subtotal, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook + helpers colocated with the provider.
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
