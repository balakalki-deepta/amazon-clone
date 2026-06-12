/**
 * Module-local types for products.
 */

import type { Prisma } from '@prisma/client';

/** A product row joined with its category — the shape the repository returns. */
export type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

/** A product row with everything the detail page needs. */
export type ProductDetailRow = Prisma.ProductGetPayload<{
  include: { category: true; images: true; specifications: true };
}>;

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

/** Full product payload for the detail page (extends the list item). */
export interface ProductDetail extends ProductListItem {
  description: string | null;
  sku: string | null;
  images: { id: number; url: string; position: number; altText: string | null }[];
  specifications: { id: number; key: string; value: string; position: number }[];
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
