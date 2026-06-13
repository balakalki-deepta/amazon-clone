/**
 * Order routes.
 *   POST /api/orders                  create an order from cart + address
 *   GET  /api/orders                  list the user's orders (order history)
 *   GET  /api/orders/:orderNumber     fetch one order (confirmation/detail)
 */

import { Router } from 'express';
import { createOrder, listOrders, getOrder } from './order.controller';

export const orderRouter = Router();

orderRouter.post('/', createOrder);
orderRouter.get('/', listOrders);
orderRouter.get('/:orderNumber', getOrder);
