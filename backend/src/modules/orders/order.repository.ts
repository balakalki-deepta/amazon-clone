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
