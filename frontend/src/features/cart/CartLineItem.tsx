import { Link } from 'react-router-dom';
import { useCart, type CartItem } from '../../context/CartContext';
import { maxQuantityFor } from '../../context/cartQuantity';
import { formatPrice } from '../../utils/formatPrice';

interface CartLineItemProps {
  item: CartItem;
}

// Below this, show Amazon's "Only N left in stock" warning.
const LOW_STOCK_THRESHOLD = 10;

const stepBtn =
  'h-8 w-[34px] border-0 bg-[#f0f2f2] text-lg leading-none enabled:hover:bg-[#e3e6e6] disabled:cursor-not-allowed disabled:text-[#aaaaaa]';

/** One row in the cart: image, title, quantity stepper, delete, and line total. */
export default function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const detailUrl = `/product/${item.slug}`;

  const maxQty = maxQuantityFor(item.stock);
  const atMax = item.quantity >= maxQty;
  const lowStock = item.stock <= LOW_STOCK_THRESHOLD;

  return (
    <div className="grid grid-cols-[180px_1fr_auto] gap-4 border-b border-amazon-border py-[18px] max-[600px]:grid-cols-[100px_1fr]">
      <Link
        to={detailUrl}
        className="flex h-[180px] w-[180px] items-center justify-center max-[600px]:h-[100px] max-[600px]:w-[100px]"
      >
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-[13px] text-amazon-muted">No image</div>
        )}
      </Link>

      <div className="flex flex-col gap-1.5">
        <Link
          to={detailUrl}
          className="text-lg font-medium leading-tight text-amazon-ink hover:text-amazon-link-hover hover:underline"
        >
          {item.title}
        </Link>
        {lowStock ? (
          <span className="text-[13px] text-[#b12704]">
            Only {item.stock} left in stock - order soon
          </span>
        ) : (
          <span className="text-[13px] text-[#007600]">In Stock</span>
        )}

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-lg border border-amazon-border shadow-[0_2px_5px_rgba(15,17,17,0.1)]">
            <button
              type="button"
              className={stepBtn}
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-9 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              type="button"
              className={stepBtn}
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={atMax}
            >
              +
            </button>
          </div>
          <span className="text-amazon-border">|</span>
          <button
            type="button"
            className="border-0 bg-transparent text-[13px] text-amazon-link hover:text-amazon-link-hover hover:underline"
            onClick={() => removeItem(item.productId)}
          >
            Delete
          </button>
        </div>

        {atMax && (
          <span className="mt-1 text-xs text-amazon-muted">Max quantity ({maxQty}) reached</span>
        )}
      </div>

      <div className="whitespace-nowrap text-right text-lg font-bold max-[600px]:col-start-2 max-[600px]:text-left">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
}
