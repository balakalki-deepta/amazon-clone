/**
 * Data-access for the order read path. (Order *creation* is a multi-step
 * transaction coordinated in the service.)
 */

import { prisma } from '../../lib/prisma';

export async function findByOrderNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/** All orders for a user, newest first (uses the user_id + placed_at index). */
export async function findOrdersForUser(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { placedAt: 'desc' },
    include: {
      items: {
        include: { product: { select: { slug: true, thumbnailUrl: true } } },
      },
    },
  });
}
