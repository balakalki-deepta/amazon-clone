/**
 * Category routes.
 *   GET /api/categories          list all categories with product counts
 */

import { Router } from 'express';
import { listCategories } from './category.controller';

export const categoryRouter = Router();

categoryRouter.get('/', listCategories);
