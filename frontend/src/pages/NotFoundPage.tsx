import { Link } from 'react-router-dom';

/** Fallback page for any unmatched route. */
export default function NotFoundPage() {
  return (
    <div className="px-4 py-[60px] text-center">
      <h1 className="text-[28px] font-semibold">404 — Page not found</h1>
      <p className="text-amazon-muted">We couldn't find the page you were looking for.</p>
      <Link
        to="/"
        className="font-semibold text-amazon-link hover:text-amazon-link-hover hover:underline"
      >
        Go to products
      </Link>
    </div>
  );
}
