import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../features/products/useProducts';
import { useCategories } from '../features/categories/useCategories';
import CategorySidebar from '../features/products/CategorySidebar';
import ProductGrid from '../features/products/ProductGrid';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';

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
  // Guard against bad/missing ?page= values (e.g. "abc" or negatives).
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

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
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-3.5 p-3.5 min-[800px]:grid-cols-[240px_1fr]">
      <CategorySidebar
        categories={categories}
        activeCategory={category}
        onSelect={(slug) => updateParam('category', slug)}
      />

      <section className="min-h-[60vh] rounded bg-white p-3.5">
        <header className="mb-3.5 flex items-baseline gap-2.5 border-b border-amazon-border pb-2.5">
          <h1 className="text-[21px]">{search ? `Results for "${search}"` : 'All Products'}</h1>
          {data && (
            <span className="text-sm text-amazon-muted">{data.pagination.total} results</span>
          )}
        </header>

        {loading && <Spinner />}
        {error && <p className="py-5 text-[#b12704]">{error}</p>}

        {!loading && !error && !hasResults && (
          <p className="py-6 text-amazon-muted">
            No products found. Try a different search or category.
          </p>
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
