/**
 * Typed product API calls. These unwrap the backend's `{ data }` envelope so
 * callers get the payload directly.
 */

import { apiClient } from './client';
import type { ProductListResult, ProductQueryParams } from '../types';

interface Envelope<T> {
  data: T;
}

export async function getProducts(params: ProductQueryParams): Promise<ProductListResult> {
  const response = await apiClient.get<Envelope<ProductListResult>>('/products', { params });
  return response.data.data;
}
