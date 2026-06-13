import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../features/products/useProduct';
import { useCart } from '../context/CartContext';
import ImageCarousel from '../components/ImageCarousel';
import RatingStars from '../components/RatingStars';
import Price from '../components/Price';
import WishlistButton from '../components/WishlistButton';
import Spinner from '../components/Spinner';
import styles from './ProductDetailPage.module.css';

/**
 * Product Detail Page ("/product/:slug").
 *
 * Three columns (Amazon layout): image gallery, product info, and a buy box.
 * Collapses to a single column on small screens.
 */
export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, loading, error } = useProduct(slug);
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <Spinner />;
  }

  if (error || !product) {
    return (
      <div className={styles.notFound}>
        <h1>Product not found</h1>
        <Link to="/" className={styles.backLink}>
          Back to products
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  const handleBuyNow = () => {
    addItem(product);
    navigate('/cart');
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.galleryCol}>
          <ImageCarousel
            images={product.images}
            title={product.title}
            fallback={product.thumbnailUrl}
          />
        </div>

        <div className={styles.infoCol}>
          <nav className={styles.breadcrumb}>
            <Link to={`/?category=${product.category.slug}`}>{product.category.name}</Link>
          </nav>
          <h1 className={styles.title}>{product.title}</h1>
          {product.brand && <p className={styles.brand}>Brand: {product.brand}</p>}

          {product.rating !== null && (
            <div className={styles.rating}>
              <RatingStars rating={product.rating} />
              <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
            </div>
          )}

          <hr className={styles.divider} />
          <Price price={product.price} discountPercentage={product.discountPercentage} />
          <hr className={styles.divider} />

          {product.description && (
            <>
              <h2 className={styles.sectionHeading}>About this item</h2>
              <p className={styles.description}>{product.description}</p>
            </>
          )}

          {product.specifications.length > 0 && (
            <>
              <h2 className={styles.sectionHeading}>Product details</h2>
              <table className={styles.specs}>
                <tbody>
                  {product.specifications.map((spec) => (
                    <tr key={spec.id}>
                      <th>{spec.key}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <aside className={styles.buyBox}>
          <Price price={product.price} discountPercentage={product.discountPercentage} />
          <p className={outOfStock || lowStock ? styles.outOfStock : styles.inStock}>
            {outOfStock
              ? 'Currently unavailable'
              : lowStock
                ? `Only ${product.stock} left in stock - order soon`
                : 'In Stock'}
          </p>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => addItem(product)}
            disabled={outOfStock}
          >
            Add to Cart
          </button>
          <button
            type="button"
            className={styles.buyButton}
            onClick={handleBuyNow}
            disabled={outOfStock}
          >
            Buy Now
          </button>
          <WishlistButton product={product} variant="full" />
        </aside>
      </div>
    </div>
  );
}
