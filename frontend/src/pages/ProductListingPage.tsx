import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../features/products/useProducts';
import { useCategories } from '../features/categories/useCategories';
import CategorySidebar from '../features/products/CategorySidebar';
import ProductGrid from '../features/products/ProductGrid';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import styles from './ProductListingPage.module.css';

/**
 * Product Listing Page ("/").
 *
 * The URL query string is the source of truth for search, category, and page.
 * Reading from it (instead of local state) makes results shareable/bookmarkable
 * and keeps the browser back button working.
 */
export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const { data, loading, error } = useProducts({ search, category, page });
  const { categories } = useCategories();

  /** Update one query param; changing a filter/search resets back to page 1. */
  function updateParam(key: string, value?: string | number) {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === '') {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== 'page') {
      next.delete('page');
    }
    setSearchParams(next);
  }

  const hasResults = data && data.products.length > 0;

  return (
    <div className={styles.layout}>
      <CategorySidebar
        categories={categories}
        activeCategory={category}
        onSelect={(slug) => updateParam('category', slug)}
      />

      <section className={styles.content}>
        <header className={styles.resultsHeader}>
          <h1 className={styles.title}>{search ? `Results for "${search}"` : 'All Products'}</h1>
          {data && <span className={styles.count}>{data.pagination.total} results</span>}
        </header>

        {loading && <Spinner />}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && !hasResults && (
          <p className={styles.empty}>No products found. Try a different search or category.</p>
        )}

        {!loading && !error && hasResults && (
          <>
            <ProductGrid products={data.products} />
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={(nextPage) => updateParam('page', nextPage)}
            />
          </>
        )}
      </section>
    </div>
  );
}
