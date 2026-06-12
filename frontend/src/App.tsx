import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import ProductListingPage from './pages/ProductListingPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Route table. Everything renders inside <Layout/> (the Amazon shell), so the
 * header and footer are shared across pages. New pages are added as routes here.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
