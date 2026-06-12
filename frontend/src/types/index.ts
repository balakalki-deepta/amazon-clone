/**
 * Shared TypeScript types that mirror the backend API's response shapes.
 * Kept in one place so components and API functions agree on the data model.
 */

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  brand: string | null;
  price: number;
  discountPercentage: number;
  rating: number | null;
  stock: number;
  thumbnailUrl: string | null;
  category: ProductCategory;
}

export interface ProductImage {
  id: number;
  url: string;
  position: number;
  altText: string | null;
}

export interface ProductSpecification {
  id: number;
  key: string;
  value: string;
  position: number;
}

/** Full product for the detail page (extends the list item). */
export interface ProductDetail extends Product {
  description: string | null;
  sku: string | null;
  images: ProductImage[];
  specifications: ProductSpecification[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResult {
  products: Product[];
  pagination: Pagination;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  page?: number;
}
