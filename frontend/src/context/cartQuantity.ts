/**
 * Cart quantity limits, shared by the cart context and the cart UI.
 */

/** Hard per-line ceiling. Must match the backend order schema's `quantity` max. */
export const MAX_CART_QUANTITY = 100;

/** Highest quantity allowed for an item: min(available stock, hard ceiling). */
export function maxQuantityFor(stock: number | undefined): number {
  return Math.min(stock ?? MAX_CART_QUANTITY, MAX_CART_QUANTITY);
}
