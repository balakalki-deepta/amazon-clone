import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Header.module.css';

/**
 * Amazon-style top navigation: logo, delivery location, the global search box,
 * account/orders links, and the cart. The search box drives the listing page by
 * pushing a `?search=` query param onto the URL.
 */
export default function Header() {
  const [searchParams] = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('search') ?? '');
  const navigate = useNavigate();

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
  }

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <Link to="/" className={styles.logo} aria-label="Amazon Clone home">
          amazon<span>.clone</span>
        </Link>

        <div className={styles.deliver}>
          <span className={styles.line1}>Deliver to</span>
          <span className={styles.line2}>📍 India</span>
        </div>

        <form className={styles.search} onSubmit={handleSearch} role="search">
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search Amazon Clone"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            aria-label="Search products"
          />
          <button className={styles.searchButton} type="submit" aria-label="Search">
            🔍
          </button>
        </form>

        <div className={styles.account}>
          <span className={styles.line1}>Hello, sign in</span>
          <span className={styles.line2}>Account &amp; Lists</span>
        </div>

        <div className={styles.orders}>
          <span className={styles.line1}>Returns</span>
          <span className={styles.line2}>&amp; Orders</span>
        </div>

        <Link to="/cart" className={styles.cart} aria-label="Cart">
          <span className={styles.cartIcon}>🛒</span>
          <span className={styles.line2}>Cart</span>
        </Link>
      </div>

      <nav className={styles.subnav} aria-label="Departments">
        <Link to="/" className={styles.subnavLink}>
          ☰ All
        </Link>
        <Link to="/" className={styles.subnavLink}>Today's Deals</Link>
        <Link to="/" className={styles.subnavLink}>Customer Service</Link>
        <Link to="/" className={styles.subnavLink}>Registry</Link>
        <Link to="/" className={styles.subnavLink}>Gift Cards</Link>
        <Link to="/" className={styles.subnavLink}>Sell</Link>
      </nav>
    </header>
  );
}
