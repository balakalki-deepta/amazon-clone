import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * The app shell: header on top, the active page in the middle (<Outlet/>),
 * footer at the bottom. Flex column keeps the footer pinned to the bottom even
 * on short pages.
 */
export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
