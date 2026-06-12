import { Link } from 'react-router-dom';

/** Fallback page for any unmatched route. */
export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 16px' }}>
      <h1 style={{ fontSize: 28 }}>404 — Page not found</h1>
      <p style={{ color: 'var(--text-muted)' }}>We couldn't find the page you were looking for.</p>
      <Link to="/" style={{ color: 'var(--amazon-link)', fontWeight: 600 }}>
        Go to products
      </Link>
    </div>
  );
}
