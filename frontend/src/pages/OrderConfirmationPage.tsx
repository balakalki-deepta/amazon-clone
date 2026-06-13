import { Link, useParams } from 'react-router-dom';
import { useOrder } from '../features/orders/useOrder';
import { formatPrice } from '../utils/formatPrice';
import Spinner from '../components/Spinner';

/**
 * Order Confirmation page ("/order/:orderNumber").
 *
 * Fetches the placed order from the backend (proving it persisted) and shows
 * the order id, items, totals, and shipping address.
 */
export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const { data: order, loading, error } = useOrder(orderNumber);

  if (loading) {
    return <Spinner />;
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-[1000px] p-4">
        <div className="rounded-lg bg-white p-10 text-center">
          <h1 className="text-xl font-semibold">Order not found</h1>
          <Link to="/" className="text-amazon-link">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const address = order.shippingAddress;

  return (
    <div className="mx-auto max-w-[1000px] p-4 max-[600px]:p-3">
      <div className="mb-4 flex items-center gap-4 rounded-lg border border-[#007600] bg-white p-5 max-[600px]:p-4">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#007600] text-[22px] text-white">
          ✓
        </span>
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-[#007600] max-[600px]:text-lg">
            Thank you, your order is placed!
          </h1>
          <p className="m-0 text-[15px]">
            Order ID: <strong className="font-mono text-base">{order.orderNumber}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 min-[800px]:grid-cols-[1fr_320px]">
        <section className="rounded-lg bg-white p-5">
          <h2 className="mb-3.5 text-lg font-semibold">Order details</h2>
          <ul className="mb-3 flex list-none flex-col gap-2.5 p-0">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2.5 text-sm">
                <span className="text-amazon-ink">
                  {item.productTitle} <span className="text-amazon-muted">× {item.quantity}</span>
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between border-t border-amazon-border py-1.5 text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between border-t border-amazon-border py-1.5 text-sm">
            <span>Shipping</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-amazon-border py-2 text-lg font-bold text-[#b12704]">
            <span>Order total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </section>

        <aside className="rounded-lg bg-white p-5">
          <h2 className="mb-3.5 text-lg font-semibold">Shipping to</h2>
          <address className="text-sm not-italic leading-[1.7] text-amazon-ink">
            {address.fullName}
            <br />
            {address.line1}
            {address.line2 ? (
              <>
                <br />
                {address.line2}
              </>
            ) : null}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
            <br />
            {address.phone}
          </address>
        </aside>
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <Link
          to="/"
          className="font-semibold text-amazon-link hover:text-amazon-link-hover hover:underline"
        >
          Continue shopping
        </Link>
        <Link
          to="/orders"
          className="font-semibold text-amazon-link hover:text-amazon-link-hover hover:underline"
        >
          View your orders
        </Link>
      </div>
    </div>
  );
}
