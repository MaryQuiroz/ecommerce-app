import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState({ success: false, message: '' });
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSubscribeStatus({ success: false, message: 'Por favor, introduce un email válido.' });
      return;
    }
    
    // Simulamos una suscripción exitosa
    setSubscribeStatus({ success: true, message: '¡Gracias por suscribirte a nuestro newsletter!' });
    setEmail('');
    
    // Después de 5 segundos, limpiamos el mensaje
    setTimeout(() => {
      setSubscribeStatus({ success: false, message: '' });
    }, 5000);
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div>
            <Link to="/" className="font-playfair text-2xl font-bold text-[var(--color-primary)]">
              Bella Beauty
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              Descubre nuestra línea de productos de belleza y cuidado personal, 
              elaborados con ingredientes naturales y comprometidos con prácticas sostenibles.
            </p>
            
            <div className="mt-6 flex items-center space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                </svg>
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Pinterest"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Comprar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categoria/skincare" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Cuidado facial
                </Link>
              </li>
              <li>
                <Link to="/categoria/maquillaje" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Maquillaje
                </Link>
              </li>
              <li>
                <Link to="/categoria/cabello" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Cuidado del cabello
                </Link>
              </li>
              <li>
                <Link to="/categoria/fragancias" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Fragancias
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/nuevos" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Nuevos productos
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Información */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/nosotros" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="/envios" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Envíos y devoluciones
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Términos y condiciones
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4">
              Suscríbete para recibir noticias, actualizaciones y ofertas especiales.
            </p>
            
            <form onSubmit={handleSubscribe}>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-r-lg transition-colors"
                >
                  OK
                </button>
              </div>
              
              {subscribeStatus.message && (
                <p className={`mt-2 text-xs ${
                  subscribeStatus.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscribeStatus.message}
                </p>
              )}
            </form>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Métodos de pago</h4>
              <div className="flex items-center space-x-2">
                <img src="/assets/images/payment/visa.svg" alt="Visa" className="h-6" />
                <img src="/assets/images/payment/mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="/assets/images/payment/amex.svg" alt="American Express" className="h-6" />
                <img src="/assets/images/payment/paypal.svg" alt="PayPal" className="h-6" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} Bella Beauty. Todos los derechos reservados.
          </p>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link to="/privacidad" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-600 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 