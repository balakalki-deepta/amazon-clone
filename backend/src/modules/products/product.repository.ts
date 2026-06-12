/**
 * Data-access layer for products: the only place that talks to Prisma for this
 * module. It translates simple filter params into a Prisma query.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

interface FindProductsParams {
  skip: number;
  take: number;
  search?: string;
  category?: string; // category slug
}

/**
 * Fetch a page of products (joined with their category) plus the total count of
 * rows matching the same filter. Both run in one transaction so the count is a
 * consistent snapshot for the returned page.
 */
export async function findProducts({ skip, take, search, category }: FindProductsParams) {
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    // Case-insensitive substring match → uses the pg_trgm GIN index on title.
    where.title = { contains: search, mode: 'insensitive' };
  }
  if (category) {
    where.category = { is: { slug: category } };
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' },
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

/** Fetch a single product (with category, ordered images, and ordered specs). */
export async function findProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { position: 'asc' } },
      specifications: { orderBy: { position: 'asc' } },
    },
  });
}
