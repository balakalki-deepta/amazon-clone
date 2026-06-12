/**
 * Module-local types for products.
 */

import type { Prisma } from '@prisma/client';

/** A product row joined with its category — the shape the repository returns. */
export type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

/** The lean, API-facing shape a listing card needs (Decimals converted to numbers). */
export interface ProductListItem {
  id: number;
  title: string;
  slug: string;
  brand: string | null;
  price: number;
  discountPercentage: number;
  rating: number | null;
  stock: number;
  thumbnailUrl: string | null;
  category: { id: number; name: string; slug: string };
}

/** Paginated response payload for the listing endpoint. */
export interface ProductListResult {
  products: ProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
