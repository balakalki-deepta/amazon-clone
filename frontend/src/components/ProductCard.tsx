import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';
import Price from './Price';
import WishlistButton from './WishlistButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    <Card className="relative gap-2 rounded-lg p-3.5 transition-shadow hover:shadow-md">
      <WishlistButton product={product} />

      <Link to={detailUrl} className="flex h-[200px] items-center justify-center">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="text-sm text-amazon-muted">No image</div>
        )}
      </Link>

      <Link
        to={detailUrl}
        className="line-clamp-2 min-h-[39px] text-[15px] leading-tight text-amazon-link hover:text-amazon-link-hover hover:underline"
      >
        {product.title}
      </Link>

      {product.rating !== null && (
        <div className="flex items-center gap-1.5">
          <RatingStars rating={product.rating} />
          <span className="text-[13px] text-amazon-link">{product.rating.toFixed(1)}</span>
        </div>
      )}

      <Price price={product.price} discountPercentage={product.discountPercentage} />

      <span className={outOfStock ? 'text-[13px] text-[#b12704]' : 'text-[13px] text-[#007600]'}>
        {outOfStock ? 'Currently unavailable' : 'In stock'}
      </span>

      <Button
        type="button"
        onClick={() => addItem(product)}
        disabled={outOfStock}
        className="mt-2 w-full rounded-full border border-[#fcd200] bg-amazon-yellow text-amazon-ink hover:bg-amazon-yellow-hover"
      >
        Add to Cart
      </Button>
    </Card>
  );
}
