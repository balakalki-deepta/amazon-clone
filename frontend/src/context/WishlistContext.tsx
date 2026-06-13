/**
 * Client-side wishlist ("save for later"), persisted to localStorage.
 *
 * Mirrors the cart's approach: a personal list with no server pricing or
 * transactions, so it lives in the browser (no auth in this app). We store the
 * whole Product so the wishlist page can reuse the normal ProductCard.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../types';

interface WishlistContextValue {
  items: Product[];
  count: number;
  has: (productId: number) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = 'amazon-clone-wishlist';

function readStoredWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(readStoredWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function has(productId: number): boolean {
    return items.some((product) => product.id === productId);
  }

  /** Add the product if it's not saved, otherwise remove it. */
  function toggle(product: Product) {
    setItems((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [product, ...current],
    );
  }

  function remove(productId: number) {
    setItems((current) => current.filter((item) => item.id !== productId));
  }

  return (
    <WishlistContext.Provider value={{ items, count: items.length, has, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider.
export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
