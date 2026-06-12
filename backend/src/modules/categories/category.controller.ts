/**
 * HTTP glue for categories.
 */

import type { Request, Response } from 'express';
import * as categoryService from './category.service';
import { sendSuccess } from '../../utils/apiResponse';

export async function listCategories(_req: Request, res: Response): Promise<void> {
  const categories = await categoryService.listCategories();
  sendSuccess(res, { categories });
}
