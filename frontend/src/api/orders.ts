/**
 * Typed order API calls.
 */

import { apiClient } from './client';
import type { CreateOrderPayload, OrderDetail } from '../types';

interface Envelope<T> {
  data: T;
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderDetail> {
  const response = await apiClient.post<Envelope<OrderDetail>>('/orders', payload);
  return response.data.data;
}

export async function getOrder(orderNumber: string): Promise<OrderDetail> {
  const response = await apiClient.get<Envelope<OrderDetail>>(`/orders/${orderNumber}`);
  return response.data.data;
}
