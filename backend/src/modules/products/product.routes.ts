/**
 * Product routes.
 *   GET /api/products            list (supports ?search= &category= &page= &limit=)
 */

import { Router } from 'express';
import { listProducts } from './product.controller';

export const productRouter = Router();

productRouter.get('/', listProducts);
