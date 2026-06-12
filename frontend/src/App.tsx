import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
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
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
