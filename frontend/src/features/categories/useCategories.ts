/**
 * Loads the category list once (for the filter sidebar).
 */

import { useEffect, useState } from 'react';
import { getCategories } from '../../api/categories';
import type { Category } from '../../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((result) => {
        if (!cancelled) setCategories(result);
      })
      .catch(() => {
        // Sidebar simply stays empty if categories fail to load.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories };
}
