/** Format a number as a USD price string, e.g. 9.99 -> "$9.99". */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
