import { formatPrice } from '../utils/formatPrice';
import styles from './Price.module.css';

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
    <div className={styles.wrap}>
      <div className={styles.row}>
        {hasDeal && <span className={styles.deal}>-{Math.round(discountPercentage)}%</span>}
        <span className={styles.price}>
          <span className={styles.symbol}>$</span>
          <span className={styles.whole}>{whole}</span>
          <span className={styles.cents}>{cents}</span>
        </span>
      </div>
      {listPrice !== null && (
        <span className={styles.listLabel}>
          List: <span className={styles.strike}>{formatPrice(listPrice)}</span>
        </span>
      )}
    </div>
  );
}
