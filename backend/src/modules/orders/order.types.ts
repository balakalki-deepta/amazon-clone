/**
 * Module-local types for orders.
 */

import type { Prisma } from '@prisma/client';

export type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export interface OrderItemDto {
  id: number;
  productId: number | null;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: OrderShippingAddress;
  items: OrderItemDto[];
  placedAt: string;
}
