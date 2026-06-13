/**
 * Business logic for orders.
 *
 * createOrder is the important one: it resolves authoritative prices from the
 * database (never trusting the client), validates stock, snapshots product and
 * address data onto the order, decrements stock, and persists everything in a
 * single transaction so an order is all-or-nothing.
 */

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import { DEFAULT_USER_EMAIL } from '../../config/constants';
import * as orderRepository from './order.repository';
import type { CreateOrderInput } from './order.schema';
import type {
  OrderDetail,
  OrderSummary,
  OrderWithItems,
  OrderWithItemsAndProducts,
} from './order.types';

/** Look up the single seeded "logged-in" user. */
async function getDefaultUser() {
  const user = await prisma.user.findFirst({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) {
    throw new ApiError(500, 'Default user not found. Run the database seed.', 'NO_DEFAULT_USER');
  }
  return user;
}

/** Round to 2 decimal places to avoid floating-point money drift. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Public, human-facing order id, e.g. ORD-20260612-A1B2C3. */
function generateOrderNumber(): string {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${ymd}-${random}`;
}

function toOrderDetail(order: OrderWithItems): OrderDetail {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    tax: Number(order.tax),
    total: Number(order.total),
    shippingAddress: {
      fullName: order.shipFullName,
      phone: order.shipPhone,
      line1: order.shipLine1,
      line2: order.shipLine2,
      city: order.shipCity,
      state: order.shipState,
      postalCode: order.shipPostalCode,
      country: order.shipCountry,
    },
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productTitle: item.productTitle,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      lineTotal: Number(item.lineTotal),
    })),
    placedAt: order.placedAt.toISOString(),
  };
}

function toOrderSummary(order: OrderWithItemsAndProducts): OrderSummary {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: Number(order.total),
    placedAt: order.placedAt.toISOString(),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    items: order.items.map((item) => ({
      id: item.id,
      productTitle: item.productTitle,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
      slug: item.product?.slug ?? null,
      thumbnailUrl: item.product?.thumbnailUrl ?? null,
    })),
  };
}

export async function listOrders(): Promise<OrderSummary[]> {
  const user = await getDefaultUser();
  const orders = await orderRepository.findOrdersForUser(user.id);
  return orders.map(toOrderSummary);
}

export async function createOrder(input: CreateOrderInput): Promise<OrderDetail> {
  const user = await getDefaultUser();

  // Merge duplicate product lines so quantities are summed once. Without this,
  // the same productId sent twice could each pass the stock check individually
  // and then over-decrement stock.
  const mergedItems = [
    ...input.items
      .reduce((map, item) => {
        map.set(item.productId, (map.get(item.productId) ?? 0) + item.quantity);
        return map;
      }, new Map<number, number>())
      .entries(),
  ].map(([productId, quantity]) => ({ productId, quantity }));

  const order = await prisma.$transaction(async (tx) => {
    // Resolve current product data for every line.
    const productIds = mergedItems.map((item) => item.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    const productById = new Map(products.map((product) => [product.id, product]));

    // Build snapshotted line items with server-side prices, validating stock.
    let subtotal = 0;
    const orderItems = mergedItems.map((item) => {
      const product = productById.get(item.productId);
      if (!product) {
        throw ApiError.badRequest(`Product ${item.productId} does not exist`);
      }
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for "${product.title}"`);
      }
      const unitPrice = Number(product.price);
      const lineTotal = round2(unitPrice * item.quantity);
      subtotal += lineTotal;
      return {
        productId: product.id,
        productTitle: product.title,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    // Decrement stock for each ordered product.
    for (const item of mergedItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const shippingFee = 0;
    const tax = 0;
    const total = round2(subtotal + shippingFee + tax);
    const { shippingAddress } = input;

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        subtotal: round2(subtotal),
        shippingFee,
        tax,
        total,
        shipFullName: shippingAddress.fullName,
        shipPhone: shippingAddress.phone,
        shipLine1: shippingAddress.line1,
        shipLine2: shippingAddress.line2 ?? null,
        shipCity: shippingAddress.city,
        shipState: shippingAddress.state,
        shipPostalCode: shippingAddress.postalCode,
        shipCountry: shippingAddress.country,
        items: { create: orderItems },
      },
      include: { items: true },
    });
  });

  return toOrderDetail(order);
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDetail> {
  const order = await orderRepository.findByOrderNumber(orderNumber);
  if (!order) {
    throw ApiError.notFound(`Order not found: ${orderNumber}`);
  }
  return toOrderDetail(order);
}
