import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartLineItem from '../features/cart/CartLineItem';
import { formatPrice } from '../utils/formatPrice';
import { Button } from '@/components/ui/button';

/**
 * Shopping Cart page ("/cart").
 *
 * Reads everything from the cart context: the line items, the live subtotal,
 * and total quantity. Editing happens inside each CartLineItem.
 */
export default function CartPage() {
  const { items, totalQuantity, subtotal } = useCart();

  const itemNoun = totalQuantity === 1 ? 'item' : 'items';

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] p-4">
        <div className="rounded-lg bg-white p-[30px]">
          <h1 className="mb-2.5 text-[28px] font-normal">Your Amazon Clone Cart is empty</h1>
          <Link to="/" className="text-amazon-link hover:text-amazon-link-hover hover:underline">
            Shop today's deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] p-4">
      <div className="grid grid-cols-1 items-start gap-4 min-[800px]:grid-cols-[1fr_300px]">
        <section className="rounded-lg bg-white p-5">
          <h1 className="text-[28px] font-normal">Shopping Cart</h1>
          <div className="border-b border-amazon-border pb-2 text-right text-[13px] text-amazon-muted">
            Price
          </div>

          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}

          <div className="pt-4 text-right text-lg">
            Subtotal ({totalQuantity} {itemNoun}):{' '}
            <strong className="font-bold">{formatPrice(subtotal)}</strong>
          </div>
        </section>

        <aside className="sticky top-[120px] rounded-lg bg-white p-[18px] max-[800px]:static">
          <div className="mb-3.5 text-lg">
            Subtotal ({totalQuantity} {itemNoun}):{' '}
            <strong className="font-bold">{formatPrice(subtotal)}</strong>
          </div>
          <Button
            asChild
            className="w-full rounded-full border border-[#fcd200] bg-amazon-yellow text-amazon-ink hover:bg-amazon-yellow-hover"
          >
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
