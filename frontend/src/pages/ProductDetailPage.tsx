import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../features/products/useProduct';
import { useCart } from '../context/CartContext';
import ImageCarousel from '../components/ImageCarousel';
import RatingStars from '../components/RatingStars';
import Price from '../components/Price';
import WishlistButton from '../components/WishlistButton';
import Spinner from '../components/Spinner';
import ProductFeatures, { type ProductFeature } from '../features/products/ProductFeatures';
import ProductOffers from '../features/products/ProductOffers';
import ProductInfoSection from '../features/products/ProductInfoSection';
import RelatedProducts from '../features/products/RelatedProducts';
import { formatDate } from '../utils/formatDate';
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

  // Pull a few known specs for the feature row, about list, and buy box.
  const findSpec = (key: string) => product.specifications.find((s) => s.key === key)?.value;
  const shipping = findSpec('Shipping');
  const returnPolicy = findSpec('Return Policy');
  const warranty = findSpec('Warranty');
  const weight = findSpec('Weight');
  const dimensions = findSpec('Dimensions');

  const returnLabel =
    returnPolicy && /no return/i.test(returnPolicy)
      ? 'Non-returnable'
      : returnPolicy
        ? returnPolicy.replace(/return policy/i, 'Returnable').trim()
        : '10 days Returnable';

  const features: ProductFeature[] = [
    { name: 'delivery', label: 'Free Delivery' },
    { name: 'cod', label: 'Pay on Delivery' },
    { name: 'returns', label: returnLabel },
    { name: 'warranty', label: warranty ?? 'Warranty Policy' },
    { name: 'secure', label: 'Secure transaction' },
  ];
  if (product.brand) features.push({ name: 'brand', label: 'Top Brand' });

  const aboutBullets: string[] = [];
  if (product.brand) aboutBullets.push(`Brand: ${product.brand}`);
  if (warranty) aboutBullets.push(`Warranty: ${warranty}`);
  if (returnPolicy) aboutBullets.push(`Return policy: ${returnPolicy}`);
  if (shipping) aboutBullets.push(`Delivery: ${shipping}`);
  if (dimensions) aboutBullets.push(`Dimensions: ${dimensions}`);
  if (weight) aboutBullets.push(`Weight: ${weight}`);

  // Estimated delivery: a few days out.
  const deliveryDate = formatDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString());

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
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

            <ProductOffers />

            <ProductFeatures features={features} />

            {aboutBullets.length > 0 && (
              <>
                <h2 className={styles.sectionHeading}>About this item</h2>
                <ul className={styles.aboutList}>
                  {aboutBullets.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className={styles.buyBox}>
            <Price price={product.price} discountPercentage={product.discountPercentage} />
            {!outOfStock && (
              <p className={styles.delivery}>
                🚚 FREE delivery <strong>{deliveryDate}</strong>
              </p>
            )}
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

            <dl className={styles.buyMeta}>
              <div>
                <dt>Ships from</dt>
                <dd>Amazon Clone</dd>
              </div>
              <div>
                <dt>Sold by</dt>
                <dd>Amazon Clone</dd>
              </div>
              {returnPolicy && (
                <div>
                  <dt>Returns</dt>
                  <dd>{returnPolicy}</dd>
                </div>
              )}
              <div>
                <dt>Payment</dt>
                <dd>Secure transaction</dd>
              </div>
            </dl>
          </aside>
        </div>

        <ProductInfoSection product={product} />

        <RelatedProducts categorySlug={product.category.slug} excludeId={product.id} />
      </div>
    </div>
  );
}
