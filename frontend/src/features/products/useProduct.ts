/**
 * Fetches a single product by slug for the detail page.
 */

import { useEffect, useState } from 'react';
import { getProductBySlug } from '../../api/products';
import type { ProductDetail } from '../../types';

export function useProduct(slug: string | undefined) {
  const [data, setData] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getProductBySlug(slug)
      .then((product) => {
        if (!cancelled) setData(product);
      })
      .catch(() => {
        if (!cancelled) setError('We could not find that product.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data, loading, error };
}
