/**
 * Business logic for categories: map DB rows to the API-facing shape.
 */

import * as categoryRepository from './category.repository';
import type { CategoryListItem } from './category.types';

export async function listCategories(): Promise<CategoryListItem[]> {
  const categories = await categoryRepository.findCategories();
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    productCount: category._count.products,
  }));
}
