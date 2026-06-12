/**
 * HTTP glue for products: read/validate the request, delegate to the service,
 * shape the response. No business logic or DB access here.
 */

import type { Request, Response } from 'express';
import { productQuerySchema } from './product.schema';
import * as productService from './product.service';
import { sendSuccess } from '../../utils/apiResponse';

export async function listProducts(req: Request, res: Response): Promise<void> {
  const query = productQuerySchema.parse(req.query); // throws ZodError -> 400
  const result = await productService.listProducts(query);
  sendSuccess(res, result);
}
