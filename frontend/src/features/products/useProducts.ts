/**
 * Fetches a page of products whenever the search/category/page inputs change.
 * Returns data plus loading and error flags so the page can render each state.
 */

import { useEffect, useState } from 'react';
import { getProducts } from '../../api/products';
import type { ProductListResult, ProductQueryParams } from '../../types';

export function useProducts({ search, category, page }: ProductQueryParams) {
  const [data, setData] = useState<ProductListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard against setting state after the inputs change / component unmounts.
    let cancelled = false;

    setLoading(true);
    setError(null);

    getProducts({ search, category, page })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load products. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, category, page]);

  return { data, loading, error };
}
