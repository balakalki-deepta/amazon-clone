import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../features/products/ProductGrid';
import styles from './WishlistPage.module.css';

/**
 * Wishlist page ("/wishlist"): saved products, reusing the normal product grid.
 * Each card's heart is filled and clicking it removes the item.
 */
export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Your Wishlist</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your wishlist is empty.</p>
          <Link to="/" className={styles.shopLink}>
            Browse products
          </Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
