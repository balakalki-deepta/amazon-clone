import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../features/products/ProductGrid';

/**
 * Wishlist page ("/wishlist"): saved products, reusing the normal product grid.
 * Each card's heart is filled and clicking it removes the item.
 */
export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-5">
      <h1 className="mb-4 text-[28px] font-normal">Your Wishlist</h1>

      {items.length === 0 ? (
        <div className="rounded-lg bg-white p-[30px]">
          <p className="mb-2.5">Your wishlist is empty.</p>
          <Link
            to="/"
            className="font-semibold text-amazon-link hover:text-amazon-link-hover hover:underline"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
