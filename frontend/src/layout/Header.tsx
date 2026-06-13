import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const navLink =
  'whitespace-nowrap rounded-sm border border-transparent px-1.5 py-1 hover:border-white';
const cell =
  'flex flex-col rounded-sm border border-transparent px-2 py-1.5 hover:border-white whitespace-nowrap';

/**
 * Amazon-style top navigation: logo, delivery location, the global search box,
 * account/orders links, and the cart. The search box drives the listing page by
 * pushing a `?search=` query param onto the URL.
 */
export default function Header() {
  const [searchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('search') ?? '');
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { count: wishlistCount } = useWishlist();

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
  }

  return (
    <header className="sticky top-0 z-[100]">
      {/* Primary bar */}
      <div className="flex h-[60px] items-center gap-1.5 bg-amazon-dark px-3.5 text-white max-[600px]:h-auto max-[600px]:flex-wrap max-[600px]:gap-2 max-[600px]:py-2">
        <Link
          to="/"
          aria-label="Amazon Clone home"
          className="rounded-sm border border-transparent p-2 text-[22px] font-bold text-white hover:border-white max-[600px]:p-1 max-[600px]:text-xl"
        >
          amazon<span className="text-amazon-orange">.clone</span>
        </Link>

        <div className={`${cell} max-[700px]:hidden`}>
          <span className="text-xs text-gray-300">Deliver to</span>
          <span className="text-sm font-bold">📍 India</span>
        </div>

        <form
          onSubmit={handleSearch}
          role="search"
          className="flex h-10 min-w-0 flex-1 overflow-hidden rounded focus-within:outline focus-within:outline-[3px] focus-within:outline-amazon-orange max-[600px]:order-3 max-[600px]:basis-full"
        >
          <input
            type="text"
            placeholder="Search Amazon Clone"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            aria-label="Search products"
            className="min-w-0 bg-white flex-1 border-0 px-3 text-[15px] text-amazon-ink outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex w-[45px] items-center justify-center bg-amazon-yellow text-lg hover:bg-amazon-yellow-hover"
          >
            🔍
          </button>
        </form>

        <div className={`${cell} max-[700px]:hidden`}>
          <span className="text-xs text-gray-300">Hello, sign in</span>
          <span className="text-sm font-bold">Account &amp; Lists</span>
        </div>

        <Link to="/orders" className={`${cell} max-[700px]:hidden`}>
          <span className="text-xs text-gray-300">Returns</span>
          <span className="text-sm font-bold">&amp; Orders</span>
        </Link>

        <Link
          to="/cart"
          aria-label={`Cart, ${totalQuantity} items`}
          className="flex items-end gap-1 rounded-sm border border-transparent px-2 py-1.5 hover:border-white max-[600px]:ml-auto"
        >
          <span className="relative">
            <span className="text-[22px]">🛒</span>
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-amazon-orange px-1 text-xs font-bold text-amazon-dark">
                {totalQuantity}
              </span>
            )}
          </span>
          <span className="text-sm font-bold">Cart</span>
        </Link>
      </div>

      {/* Secondary bar */}
      <nav
        aria-label="Departments"
        className="flex items-center gap-3 overflow-x-auto bg-amazon-darklight px-3.5 py-1.5 text-sm text-white"
      >
        <Link to="/" className={navLink}>
          ☰ All
        </Link>
        <Link to="/wishlist" className={navLink}>
          ♥ Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
        </Link>
        <Link to="/orders" className={navLink}>
          Your Orders
        </Link>
        <Link to="/" className={navLink}>
          Today's Deals
        </Link>
        <Link to="/" className={navLink}>
          Customer Service
        </Link>
        <Link to="/" className={navLink}>
          Registry
        </Link>
        <Link to="/" className={navLink}>
          Gift Cards
        </Link>
        <Link to="/" className={navLink}>
          Sell
        </Link>
      </nav>
    </header>
  );
}
