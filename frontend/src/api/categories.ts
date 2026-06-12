/**
 * Typed category API calls.
 */

import { apiClient } from './client';
import type { Category } from '../types';

interface Envelope<T> {
  data: T;
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Envelope<{ categories: Category[] }>>('/categories');
  return response.data.data.categories;
}
