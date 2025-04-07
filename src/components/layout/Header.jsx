import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import categories from '../../data/categories.json';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const accountMenuRef = useRef(null);
  
  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoryMenu(false);
      }
      
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus en el input de búsqueda al mostrarlo
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };
  
  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    navigate('/');
  };
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      {/* Anuncio en la parte superior */}
      {!isScrolled && (
        <div className="bg-[var(--color-primary)] text-white py-2 text-center text-sm">
          <div className="container mx-auto px-4">
            Envío gratis en pedidos superiores a $50 | 10% de descuento en tu primera compra con el código: <span className="font-medium">WELCOME10</span>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-playfair text-2xl font-bold text-[var(--color-primary)]">
            Bella Beauty
          </Link>
          
          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-[var(--color-primary)] font-medium">
              Inicio
            </Link>
            
            <div className="relative" ref={categoryMenuRef}>
              <button 
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center text-gray-800 hover:text-[var(--color-primary)] font-medium"
              >
                Categorías
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`ml-1 h-4 w-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCategoryMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10">
                  {categories.map((category) => (
                    <Link 
                      key={category.id} 
                      to={`/categoria/${category.id}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/ofertas" className="text-gray-800 hover:text-[var(--color-primary)] font-medium">
              Ofertas
            </Link>
            
            <Link to="/nosotros" className="text-gray-800 hover:text-[var(--color-primary)] font-medium">
              Nosotros
            </Link>
            
            <Link to="/contacto" className="text-gray-800 hover:text-[var(--color-primary)] font-medium">
              Contacto
            </Link>
          </nav>
          
          {/* Iconos de acciones */}
          <div className="flex items-center space-x-4">
            {/* Buscador */}
            <button 
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="text-gray-800 hover:text-[var(--color-primary)]"
              aria-label="Buscar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Usuario */}
            <div className="relative hidden md:block" ref={accountMenuRef}>
              <button 
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="text-gray-800 hover:text-[var(--color-primary)]"
                aria-label="Mi cuenta"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Link 
                        to="/perfil"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Mi perfil
                      </Link>
                      <Link 
                        to="/perfil/pedidos"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Mis pedidos
                      </Link>
                      <Link 
                        to="/perfil/wishlist"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Lista de deseos
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/iniciar-sesion"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Iniciar sesión
                      </Link>
                      <Link 
                        to="/registro"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Crear cuenta
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Carrito */}
            <Link 
              to="/carrito"
              className="text-gray-800 hover:text-[var(--color-primary)] relative"
              aria-label="Ver carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Botón de menú móvil */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-800 hover:text-[var(--color-primary)]"
              aria-label="Menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Barra de búsqueda expandible */}
      {showSearchBar && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-4 md:px-0 z-50">
          <div className="container mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
                className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-[var(--color-primary)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                type="button"
                className="absolute right-10 top-0 h-full px-2 text-gray-500 hover:text-red-500"
                onClick={() => setShowSearchBar(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Menú móvil */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 z-50">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="py-2 text-gray-800 hover:text-[var(--color-primary)] font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Inicio
              </Link>
              
              <div className="py-2">
                <button 
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="flex items-center text-gray-800 hover:text-[var(--color-primary)] font-medium"
                >
                  Categorías
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`ml-1 h-4 w-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showCategoryMenu && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-2">
                    {categories.map((category) => (
                      <Link 
                        key={category.id} 
                        to={`/categoria/${category.id}`}
                        className="block py-1 text-gray-800 hover:text-[var(--color-primary)]"
                        onClick={() => {
                          setShowCategoryMenu(false);
                          setShowMobileMenu(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/ofertas" 
                className="py-2 text-gray-800 hover:text-[var(--color-primary)] font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Ofertas
              </Link>
              
              <Link 
                to="/nosotros" 
                className="py-2 text-gray-800 hover:text-[var(--color-primary)] font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Nosotros
              </Link>
              
              <Link 
                to="/contacto" 
                className="py-2 text-gray-800 hover:text-[var(--color-primary)] font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Contacto
              </Link>
              
              <div className="border-t border-gray-200 pt-3 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="pb-2 mb-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      to="/perfil"
                      className="block py-2 text-gray-800 hover:text-[var(--color-primary)]"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link 
                      to="/perfil/pedidos"
                      className="block py-2 text-gray-800 hover:text-[var(--color-primary)]"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Mis pedidos
                    </Link>
                    <Link 
                      to="/perfil/wishlist"
                      className="block py-2 text-gray-800 hover:text-[var(--color-primary)]"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Lista de deseos
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left py-2 text-red-600"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/iniciar-sesion"
                      className="block py-2 text-gray-800 hover:text-[var(--color-primary)]"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Iniciar sesión
                    </Link>
                    <Link 
                      to="/registro"
                      className="block py-2 text-gray-800 hover:text-[var(--color-primary)]"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 