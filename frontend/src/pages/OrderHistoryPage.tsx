import { Link } from 'react-router-dom';
import { useOrders } from '../features/orders/useOrders';
import OrderCard from '../features/orders/OrderCard';
import Spinner from '../components/Spinner';
import styles from './OrderHistoryPage.module.css';

/**
 * Order History page ("/orders"): all of the user's past orders, newest first.
 */
export default function OrderHistoryPage() {
  const { orders, loading, error } = useOrders();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Your Orders</h1>

      {loading && <Spinner />}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>You haven't placed any orders yet.</p>
          <Link to="/" className={styles.shopLink}>
            Start shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className={styles.list}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
