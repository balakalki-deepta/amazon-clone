import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartLineItem from '../features/cart/CartLineItem';
import { formatPrice } from '../utils/formatPrice';
import styles from './CartPage.module.css';

/**
 * Shopping Cart page ("/cart").
 *
 * Reads everything from the cart context: the line items, the live subtotal,
 * and total quantity. Editing happens inside each CartLineItem.
 */
export default function CartPage() {
  const { items, totalQuantity, subtotal } = useCart();

  const itemNoun = totalQuantity === 1 ? 'item' : 'items';

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.emptyHeading}>Your Amazon Clone Cart is empty</h1>
          <Link to="/" className={styles.shopLink}>
            Shop today's deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.items}>
          <h1 className={styles.heading}>Shopping Cart</h1>
          <div className={styles.priceHeader}>Price</div>

          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}

          <div className={styles.subtotalRow}>
            Subtotal ({totalQuantity} {itemNoun}): <strong>{formatPrice(subtotal)}</strong>
          </div>
        </section>

        <aside className={styles.summary}>
          <div className={styles.summarySubtotal}>
            Subtotal ({totalQuantity} {itemNoun}): <strong>{formatPrice(subtotal)}</strong>
          </div>
          <Link to="/checkout" className={styles.checkoutButton}>
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
