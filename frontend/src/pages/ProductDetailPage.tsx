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
import { Button } from '@/components/ui/button';

/**
 * Product Detail Page ("/product/:slug").
 *
 * Three columns (Amazon layout): image gallery, product info, and a buy box.
 * Collapses to a single column on small screens (image → buy box → details).
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
      <div className="px-4 py-[60px] text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link to="/" className="font-semibold text-amazon-link">
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
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] p-4">
        <div className="grid grid-cols-[minmax(320px,1fr)_1.4fr_280px] gap-6 max-[1000px]:grid-cols-1">
          <div className="sticky top-[120px] self-start max-[1000px]:static max-[1000px]:order-1">
            <ImageCarousel
              images={product.images}
              title={product.title}
              fallback={product.thumbnailUrl}
            />
          </div>

          <div className="max-[1000px]:order-3">
            <nav className="mb-1.5 text-xs text-amazon-muted">
              <Link
                to={`/?category=${product.category.slug}`}
                className="hover:text-amazon-link-hover hover:underline"
              >
                {product.category.name}
              </Link>
            </nav>
            <h1 className="mb-1.5 text-2xl font-medium leading-tight">{product.title}</h1>
            {product.brand && (
              <p className="mb-2 text-sm text-amazon-link">Brand: {product.brand}</p>
            )}

            {product.rating !== null && (
              <div className="flex items-center gap-1.5">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-amazon-link">{product.rating.toFixed(1)}</span>
              </div>
            )}

            <hr className="my-3.5 border-0 border-t border-amazon-border" />
            <Price price={product.price} discountPercentage={product.discountPercentage} />

            <ProductOffers />

            <ProductFeatures features={features} />

            {aboutBullets.length > 0 && (
              <>
                <h2 className="mb-2 mt-4 text-lg font-semibold">About this item</h2>
                <ul className="m-0 list-disc pl-5 text-sm leading-[1.7] text-amazon-ink [&_li]:mb-1">
                  {aboutBullets.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="sticky top-[120px] flex flex-col gap-3 self-start rounded-lg border border-amazon-border p-4 max-[1000px]:static max-[1000px]:order-2">
            <Price price={product.price} discountPercentage={product.discountPercentage} />
            {!outOfStock && (
              <p className="m-0 text-sm">
                🚚 FREE delivery <strong>{deliveryDate}</strong>
              </p>
            )}
            <p
              className={
                outOfStock || lowStock
                  ? 'm-0 text-base text-[#b12704]'
                  : 'm-0 text-base text-[#007600]'
              }
            >
              {outOfStock
                ? 'Currently unavailable'
                : lowStock
                  ? `Only ${product.stock} left in stock - order soon`
                  : 'In Stock'}
            </p>
            <Button
              type="button"
              onClick={() => addItem(product)}
              disabled={outOfStock}
              className="rounded-full border border-[#fcd200] bg-amazon-yellow text-amazon-ink hover:bg-amazon-yellow-hover"
            >
              Add to Cart
            </Button>
            <Button
              type="button"
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="rounded-full border border-[#e88a00] bg-amazon-orange text-amazon-ink hover:bg-[#f08804]"
            >
              Buy Now
            </Button>
            <WishlistButton product={product} variant="full" />

            <dl className="mt-1 flex flex-col gap-1.5 border-t border-amazon-border pt-3 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-amazon-muted">Ships from</dt>
                <dd className="m-0 text-right">Amazon Clone</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-amazon-muted">Sold by</dt>
                <dd className="m-0 text-right">Amazon Clone</dd>
              </div>
              {returnPolicy && (
                <div className="flex justify-between gap-3">
                  <dt className="text-amazon-muted">Returns</dt>
                  <dd className="m-0 text-right">{returnPolicy}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-amazon-muted">Payment</dt>
                <dd className="m-0 text-right">Secure transaction</dd>
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
