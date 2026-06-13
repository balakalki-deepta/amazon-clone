/**
 * Loads the current user's order history (newest first).
 */

import { useEffect, useState } from 'react';
import { getOrders } from '../../api/orders';
import type { OrderSummary } from '../../types';

export function useOrders() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getOrders()
      .then((result) => {
        if (!cancelled) setOrders(result);
      })
      .catch(() => {
        if (!cancelled) setError('We could not load your orders. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loading, error };
}
