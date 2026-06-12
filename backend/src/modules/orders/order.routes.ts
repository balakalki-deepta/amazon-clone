/**
 * Order routes.
 *   POST /api/orders                  create an order from cart + address
 *   GET  /api/orders/:orderNumber     fetch an order (confirmation page)
 */

import { Router } from 'express';
import { createOrder, getOrder } from './order.controller';

export const orderRouter = Router();

orderRouter.post('/', createOrder);
orderRouter.get('/:orderNumber', getOrder);
