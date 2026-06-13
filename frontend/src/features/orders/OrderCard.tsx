import { Link } from 'react-router-dom';
import type { OrderSummary } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: OrderSummary;
}

/** One order in the history list: an Amazon-style card with header + items. */
export default function OrderCard({ order }: OrderCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.headerCol}>
          <span className={styles.label}>Order placed</span>
          <span className={styles.value}>{formatDate(order.placedAt)}</span>
        </div>
        <div className={styles.headerCol}>
          <span className={styles.label}>Total</span>
          <span className={styles.value}>{formatPrice(order.total)}</span>
        </div>
        <div className={styles.headerCol}>
          <span className={styles.label}>Order #</span>
          <span className={styles.value}>{order.orderNumber}</span>
        </div>
        <Link to={`/order/${order.orderNumber}`} className={styles.detailsLink}>
          View order details
        </Link>
      </header>

      <div className={styles.body}>
        <span className={styles.status}>{order.status}</span>
        <ul className={styles.items}>
          {order.items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.thumb}>
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.productTitle} />
                ) : (
                  <div className={styles.noThumb}>No image</div>
                )}
              </div>
              <div className={styles.itemInfo}>
                {item.slug ? (
                  <Link to={`/product/${item.slug}`} className={styles.itemTitle}>
                    {item.productTitle}
                  </Link>
                ) : (
                  <span className={styles.itemTitle}>{item.productTitle}</span>
                )}
                <span className={styles.itemQty}>Qty: {item.quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
