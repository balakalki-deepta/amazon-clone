/**
 * Module-local types for orders.
 */

import type { Prisma } from '@prisma/client';

export type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

/** An order with its items joined to the current product (for thumbnails/links). */
export type OrderWithItemsAndProducts = Prisma.OrderGetPayload<{
  include: { items: { include: { product: { select: { slug: true; thumbnailUrl: true } } } } };
}>;

export interface OrderSummaryItem {
  id: number;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  slug: string | null; // current product slug for linking; null if product removed
  thumbnailUrl: string | null;
}

/** Lightweight order shape for the order-history list. */
export interface OrderSummary {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  placedAt: string;
  itemCount: number; // total quantity across lines
  items: OrderSummaryItem[];
}

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
