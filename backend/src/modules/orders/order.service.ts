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
import type { OrderDetail, OrderWithItems } from './order.types';

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

export async function createOrder(input: CreateOrderInput): Promise<OrderDetail> {
  const user = await prisma.user.findFirst({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) {
    throw new ApiError(500, 'Default user not found. Run the database seed.', 'NO_DEFAULT_USER');
  }

  const order = await prisma.$transaction(async (tx) => {
    // Resolve current product data for every line.
    const productIds = input.items.map((item) => item.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });
    const productById = new Map(products.map((product) => [product.id, product]));

    // Build snapshotted line items with server-side prices, validating stock.
    let subtotal = 0;
    const orderItems = input.items.map((item) => {
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
    for (const item of input.items) {
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
