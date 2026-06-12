/**
 * HTTP glue for orders.
 */

import type { Request, Response } from 'express';
import { createOrderSchema } from './order.schema';
import * as orderService from './order.service';
import { sendSuccess } from '../../utils/apiResponse';

export async function createOrder(req: Request, res: Response): Promise<void> {
  const input = createOrderSchema.parse(req.body); // throws ZodError -> 400
  const order = await orderService.createOrder(input);
  sendSuccess(res, order, 201);
}

export async function getOrder(req: Request, res: Response): Promise<void> {
  const orderNumber = String(req.params.orderNumber);
  const order = await orderService.getOrderByNumber(orderNumber);
  sendSuccess(res, order);
}
