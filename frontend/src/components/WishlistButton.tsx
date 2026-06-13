import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../types';
import styles from './WishlistButton.module.css';

interface WishlistButtonProps {
  product: Product;
  /** 'icon' = small heart (cards); 'full' = labelled button (detail page). */
  variant?: 'icon' | 'full';
}

/** Toggles whether a product is saved in the wishlist. */
export default function WishlistButton({ product, variant = 'icon' }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);

  return (
    <button
      type="button"
      className={variant === 'full' ? styles.full : styles.icon}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={() => toggle(product)}
    >
      <span className={saved ? styles.heartFilled : styles.heart}>{saved ? '♥' : '♡'}</span>
      {variant === 'full' && <span>{saved ? 'In Wishlist' : 'Add to Wishlist'}</span>}
    </button>
  );
}
