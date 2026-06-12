import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';
import Price from './Price';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

/**
 * A single product tile for the grid: image, title (links to detail), rating,
 * price, stock status, and an Add-to-Cart button.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  const detailUrl = `/product/${product.slug}`;

  return (
    <article className={styles.card}>
      <Link to={detailUrl} className={styles.imageWrap}>
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.noImage}>No image</div>
        )}
      </Link>

      <div className={styles.body}>
        <Link to={detailUrl} className={styles.title}>
          {product.title}
        </Link>

        {product.rating !== null && (
          <div className={styles.rating}>
            <RatingStars rating={product.rating} />
            <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
          </div>
        )}

        <Price price={product.price} discountPercentage={product.discountPercentage} />

        <span className={outOfStock ? styles.outOfStock : styles.inStock}>
          {outOfStock ? 'Currently unavailable' : 'In stock'}
        </span>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => addItem(product)}
          disabled={outOfStock}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
