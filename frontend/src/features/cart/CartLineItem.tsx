import { Link } from 'react-router-dom';
import { useCart, type CartItem } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartLineItem.module.css';

interface CartLineItemProps {
  item: CartItem;
}

/** One row in the cart: image, title, quantity stepper, delete, and line total. */
export default function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const detailUrl = `/product/${item.slug}`;

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
        <span className={styles.inStock}>In Stock</span>

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
      </div>

      <div className={styles.price}>{formatPrice(item.price * item.quantity)}</div>
    </div>
  );
}
