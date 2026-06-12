/**
 * Validation for the product listing query string.
 *
 * Query params arrive as strings; zod coerces and bounds them so the rest of
 * the module can trust the shape. Invalid input throws a ZodError, which the
 * central error handler turns into a 400.
 */

import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(), // category slug
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
