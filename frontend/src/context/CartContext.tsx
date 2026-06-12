/**
 * Minimal client-side cart state, persisted to localStorage.
 *
 * Scope for now: add items and expose the total count (used by the header badge
 * and the Add-to-Cart button). Viewing/editing the cart and syncing to the
 * backend come in later steps; this keeps the listing page's button functional
 * without pulling the whole cart feature forward.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../types';

export interface CartItem {
  productId: number;
  slug: string;
  title: string;
  price: number;
  thumbnailUrl: string | null;
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
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
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
          quantity,
        },
      ];
    });
  }

  /** Set an item's quantity; a quantity of 0 or less removes it. */
  function updateQuantity(productId: number, quantity: number) {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.productId !== productId);
      }
      return current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
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

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider.
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
