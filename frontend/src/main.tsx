import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ServerGate from './components/ServerGate';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ServerGate>
        <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider>
      </ServerGate>
    </BrowserRouter>
  </React.StrictMode>,
);
