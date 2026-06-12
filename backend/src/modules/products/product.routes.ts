/**
 * Product routes.
 *   GET /api/products            list (supports ?search= &category= &page= &limit=)
 *   GET /api/products/:slug      single product detail (images + specs)
 */

import { Router } from 'express';
import { listProducts, getProduct } from './product.controller';

export const productRouter = Router();

productRouter.get('/', listProducts);
productRouter.get('/:slug', getProduct);
