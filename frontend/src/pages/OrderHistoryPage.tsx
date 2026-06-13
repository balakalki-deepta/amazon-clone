import { Link } from 'react-router-dom';
import { useOrders } from '../features/orders/useOrders';
import OrderCard from '../features/orders/OrderCard';
import Spinner from '../components/Spinner';

/**
 * Order History page ("/orders"): all of the user's past orders, newest first.
 */
export default function OrderHistoryPage() {
  const { orders, loading, error } = useOrders();

  return (
    <div className="mx-auto max-w-[1000px] p-4 max-[600px]:p-3">
      <h1 className="mb-4 text-[28px] font-normal max-[600px]:text-[22px]">Your Orders</h1>

      {loading && <Spinner />}
      {error && <p className="py-4 text-[#b12704]">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-lg bg-white p-[30px]">
          <p className="mb-2.5">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="font-semibold text-amazon-link hover:text-amazon-link-hover hover:underline"
          >
            Start shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-col">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
