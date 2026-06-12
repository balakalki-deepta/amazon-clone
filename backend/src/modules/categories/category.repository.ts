/**
 * Data-access layer for categories.
 */

import { prisma } from '../../lib/prisma';

/** All categories, alphabetised, each with how many products it contains. */
export async function findCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}
