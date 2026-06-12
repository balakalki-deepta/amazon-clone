/**
 * Business logic for products.
 *
 * Knows nothing about HTTP (no req/res). It computes pagination, calls the
 * repository, and maps DB rows into the lean API shape (converting Prisma
 * Decimals into plain numbers so responses serialize cleanly).
 */

import * as productRepository from './product.repository';
import type { ProductQuery } from './product.schema';
import type { ProductListItem, ProductListResult, ProductWithCategory } from './product.types';

/** Map a DB row (with Decimal fields) to the API-facing list item. */
function toProductListItem(product: ProductWithCategory): ProductListItem {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    brand: product.brand,
    price: Number(product.price),
    discountPercentage: Number(product.discountPercentage),
    rating: product.rating === null ? null : Number(product.rating),
    stock: product.stock,
    thumbnailUrl: product.thumbnailUrl,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
  };
}

export async function listProducts(query: ProductQuery): Promise<ProductListResult> {
  const { page, limit, search, category } = query;
  const skip = (page - 1) * limit;

  const { products, total } = await productRepository.findProducts({
    skip,
    take: limit,
    search,
    category,
  });

  return {
    products: products.map(toProductListItem),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
