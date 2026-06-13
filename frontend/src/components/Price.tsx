import { formatPrice } from '@/utils/formatPrice';

interface PriceProps {
  price: number;
  /** When > 0, shows a deal badge and the computed pre-discount "List" price. */
  discountPercentage?: number;
}

/**
 * Amazon-style price: small currency symbol, large whole number, superscript
 * cents. Optionally shows the discount badge and struck-through list price.
 */
export default function Price({ price, discountPercentage = 0 }: PriceProps) {
  const whole = Math.floor(price);
  const cents = Math.round((price - whole) * 100)
    .toString()
    .padStart(2, '0');

  const hasDeal = discountPercentage > 0;
  const listPrice = hasDeal ? price / (1 - discountPercentage / 100) : null;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        {hasDeal && (
          <span className="rounded bg-[#cc0c39] px-1.5 py-0.5 text-xs font-bold text-white">
            -{Math.round(discountPercentage)}%
          </span>
        )}
        <span className="inline-flex items-start text-amazon-ink">
          <span className="mt-[3px] text-xs">$</span>
          <span className="text-xl font-medium">{whole}</span>
          <span className="mt-[3px] text-xs">{cents}</span>
        </span>
      </div>
      {listPrice !== null && (
        <span className="text-xs text-amazon-muted">
          List: <span className="line-through">{formatPrice(listPrice)}</span>
        </span>
      )}
    </div>
  );
}
