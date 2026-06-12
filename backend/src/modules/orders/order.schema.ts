/**
 * Validation for the create-order request body.
 *
 * We only accept productId + quantity per line (never client-side prices) and a
 * shipping address. The server resolves prices itself.
 */

import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    fullName: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    line1: z.string().trim().min(1),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
    country: z.string().trim().min(1),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
