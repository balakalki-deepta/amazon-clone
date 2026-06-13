import { Link } from 'react-router-dom';
import { useCart, type CartItem } from '../../context/CartContext';
import { maxQuantityFor } from '../../context/cartQuantity';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartLineItem.module.css';

interface CartLineItemProps {
  item: CartItem;
}

// Below this, show Amazon's "Only N left in stock" warning.
const LOW_STOCK_THRESHOLD = 10;

/** One row in the cart: image, title, quantity stepper, delete, and line total. */
export default function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const detailUrl = `/product/${item.slug}`;

  const maxQty = maxQuantityFor(item.stock);
  const atMax = item.quantity >= maxQty;
  const lowStock = item.stock <= LOW_STOCK_THRESHOLD;

  return (
    <div className={styles.item}>
      <Link to={detailUrl} className={styles.imageWrap}>
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} className={styles.image} />
        ) : (
          <div className={styles.noImage}>No image</div>
        )}
      </Link>

      <div className={styles.details}>
        <Link to={detailUrl} className={styles.title}>
          {item.title}
        </Link>
        {lowStock ? (
          <span className={styles.lowStock}>Only {item.stock} left in stock - order soon</span>
        ) : (
          <span className={styles.inStock}>In Stock</span>
        )}

        <div className={styles.controls}>
          <div className={styles.stepper}>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className={styles.qty}>{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={atMax}
            >
              +
            </button>
          </div>
          <span className={styles.separator}>|</span>
          <button
            type="button"
            className={styles.delete}
            onClick={() => removeItem(item.productId)}
          >
            Delete
          </button>
        </div>

        {atMax && <span className={styles.maxNote}>Max quantity ({maxQty}) reached</span>}
      </div>

      <div className={styles.price}>{formatPrice(item.price * item.quantity)}</div>
    </div>
  );
}
