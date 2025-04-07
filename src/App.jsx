import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';

// Estilos globales
import './index.css';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/categoria/:categoryId" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/producto/:productId" element={<Layout><ProductPage /></Layout>} />
            <Route path="/carrito" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/iniciar-sesion" element={<Layout><LoginPage /></Layout>} />
            <Route path="/registro" element={<Layout><RegisterPage /></Layout>} />
            <Route path="/perfil/*" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/confirmacion-pedido/:orderId" element={<Layout><OrderConfirmationPage /></Layout>} />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
