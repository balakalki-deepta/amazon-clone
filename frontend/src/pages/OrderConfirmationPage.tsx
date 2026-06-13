import { Link, useParams } from 'react-router-dom';
import { useOrder } from '../features/orders/useOrder';
import { formatPrice } from '../utils/formatPrice';
import Spinner from '../components/Spinner';
import styles from './OrderConfirmationPage.module.css';

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
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>Order not found</h1>
          <Link to="/" className={styles.shopLink}>
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const address = order.shippingAddress;

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <span className={styles.check}>✓</span>
        <div>
          <h1 className={styles.bannerTitle}>Thank you, your order is placed!</h1>
          <p className={styles.bannerSub}>
            Order ID: <strong className={styles.orderId}>{order.orderNumber}</strong>
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        <section className={styles.panel}>
          <h2 className={styles.sectionHeading}>Order details</h2>
          <ul className={styles.items}>
            {order.items.map((item) => (
              <li key={item.id} className={styles.item}>
                <span className={styles.itemTitle}>
                  {item.productTitle} <span className={styles.itemQty}>× {item.quantity}</span>
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.totalsRow}>
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className={styles.totalsRow}>
            <span>Shipping</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className={styles.grandTotal}>
            <span>Order total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </section>

        <aside className={styles.panel}>
          <h2 className={styles.sectionHeading}>Shipping to</h2>
          <address className={styles.address}>
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

      <div className={styles.actions}>
        <Link to="/" className={styles.continue}>
          Continue shopping
        </Link>
        <Link to="/orders" className={styles.continue}>
          View your orders
        </Link>
      </div>
    </div>
  );
}
