import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  product: Product;
  /** 'icon' = small heart (cards); 'full' = labelled button (detail page). */
  variant?: 'icon' | 'full';
}

/** Toggles whether a product is saved in the wishlist. */
export default function WishlistButton({ product, variant = 'icon' }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const heartColor = saved ? 'text-[#cc0c39]' : 'text-amazon-muted';
  const label = saved ? 'Remove from wishlist' : 'Add to wishlist';

  if (variant === 'full') {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        aria-pressed={saved}
        aria-label={label}
        onClick={() => toggle(product)}
      >
        <span className={cn('text-base leading-none', heartColor)}>{saved ? '♥' : '♡'}</span>
        {saved ? 'In Wishlist' : 'Add to Wishlist'}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="absolute right-2.5 top-2.5 z-[2] rounded-full bg-white shadow-sm"
      aria-pressed={saved}
      aria-label={label}
      onClick={() => toggle(product)}
    >
      <span className={cn('text-lg leading-none', heartColor)}>{saved ? '♥' : '♡'}</span>
    </Button>
  );
}
