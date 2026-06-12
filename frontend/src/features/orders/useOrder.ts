/**
 * Fetches a placed order by its order number (for the confirmation page).
 */

import { useEffect, useState } from 'react';
import { getOrder } from '../../api/orders';
import type { OrderDetail } from '../../types';

export function useOrder(orderNumber: string | undefined) {
  const [data, setData] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getOrder(orderNumber)
      .then((order) => {
        if (!cancelled) setData(order);
      })
      .catch(() => {
        if (!cancelled) setError('We could not find that order.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  return { data, loading, error };
}
