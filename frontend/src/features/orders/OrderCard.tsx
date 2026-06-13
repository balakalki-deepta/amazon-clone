import { Link } from 'react-router-dom';
import type { OrderSummary } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

interface OrderCardProps {
  order: OrderSummary;
}

/** One order in the history list: an Amazon-style card with header + items. */
export default function OrderCard({ order }: OrderCardProps) {
  return (
    <article className="mb-4 overflow-hidden rounded-lg border border-amazon-border bg-white">
      <header className="flex flex-wrap items-center gap-6 border-b border-amazon-border bg-[#f0f2f2] px-[18px] py-3.5 max-[600px]:gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wide text-amazon-muted">
            Order placed
          </span>
          <span className="text-[13px] text-amazon-ink">{formatDate(order.placedAt)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wide text-amazon-muted">Total</span>
          <span className="text-[13px] text-amazon-ink">{formatPrice(order.total)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wide text-amazon-muted">Order #</span>
          <span className="text-[13px] text-amazon-ink">{order.orderNumber}</span>
        </div>
        <Link
          to={`/order/${order.orderNumber}`}
          className="ml-auto text-[13px] text-amazon-link hover:text-amazon-link-hover hover:underline max-[600px]:ml-0"
        >
          View order details
        </Link>
      </header>

      <div className="p-[18px]">
        <span className="mb-3.5 inline-block text-[15px] font-bold">{order.status}</span>
        <ul className="flex list-none flex-col gap-3.5 p-0">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3.5">
              <div className="flex h-16 w-16 flex-none items-center justify-center">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.productTitle}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-[11px] text-amazon-muted">No image</div>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                {item.slug ? (
                  <Link
                    to={`/product/${item.slug}`}
                    className="text-sm text-amazon-link hover:text-amazon-link-hover hover:underline"
                  >
                    {item.productTitle}
                  </Link>
                ) : (
                  <span className="text-sm text-amazon-ink">{item.productTitle}</span>
                )}
                <span className="text-[13px] text-amazon-muted">Qty: {item.quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
