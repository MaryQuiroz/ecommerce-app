import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categories from '../data/categories.json';
import products from '../data/products.json';

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // Filtrar productos best sellers
    const featuredProducts = products
      .filter(product => product.isBestSeller)
      .slice(0, 4);
    
    setBestSellers(featuredProducts);
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative">
        <div className="w-full h-[600px] md:h-[700px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Productos de belleza" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 absolute inset-0 flex items-center">
          <div className="max-w-xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Descubre tu belleza natural</h1>
            <p className="text-white text-lg md:text-xl mb-8 max-w-md">Productos premium para realzar tu belleza con ingredientes naturales cuidadosamente seleccionados.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/categoria/skincare"
                className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-full transition-colors shadow-lg text-center"
              >
                Comprar ahora
              </Link>
              <button className="px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-white font-medium rounded-full transition-colors">
                Ver colección
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Value Proposition */}
      <section className="py-12 bg-[var(--color-background-alt)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center hover-scale">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-secondary-dark)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-secondary-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ingredientes Naturales</h3>
              <p className="text-gray-600">Nuestros productos contienen ingredientes naturales y sostenibles, cuidadosamente seleccionados.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center hover-scale">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-secondary-dark)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-secondary-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">No Testado en Animales</h3>
              <p className="text-gray-600">Comprometidos con la belleza ética: Productos cruelty-free y respetuosos con el planeta.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm text-center hover-scale">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-secondary-dark)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-secondary-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Calidad Premium</h3>
              <p className="text-gray-600">Cada producto es sometido a rigurosos controles de calidad para garantizar resultados excepcionales.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Explora nuestras categorías</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Descubre nuestra cuidadosa selección de productos de belleza premium para cada necesidad.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category) => (
              <div key={category.id} className="group relative overflow-hidden rounded-lg shadow-md hover-scale">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="font-playfair text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/80 mb-4">{category.description}</p>
                    <Link to={`/categoria/${category.id}`} className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full transition-colors">
                      Ver colección
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="py-16 bg-[var(--color-background-alt)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Más vendidos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Los productos favoritos de nuestras clientas, elegidos por su excelente calidad y resultados.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm group hover-scale">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.images[0]}
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Link to={`/producto/${product.id}`} className="px-4 py-2 bg-white text-gray-800 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Vista rápida
                    </Link>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-600 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs ml-1 text-gray-600">({product.reviewCount})</span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    {product.discountPrice ? (
                      <div>
                        <span className="font-semibold text-[var(--color-primary-dark)]">${product.discountPrice}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${product.price}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-[var(--color-primary-dark)]">${product.price}</span>
                    )}
                    <button className="px-3 py-1 bg-[var(--color-primary)] text-white text-sm rounded-full hover:bg-[var(--color-primary-dark)] transition-colors">
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/categoria/todos" className="inline-block px-8 py-3 border border-[var(--color-primary)] text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] hover:text-white rounded-full transition-colors">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Beauty background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-brand opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">Únete a nuestra comunidad de belleza</h2>
            <p className="text-gray-600 mb-8">Suscríbete para recibir las últimas novedades, consejos de belleza y ofertas exclusivas.</p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="flex-grow px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
              <button 
                type="submit"
                className="whitespace-nowrap px-6 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors shadow-md"
              >
                Suscribirse
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              Al suscribirte, aceptas nuestra política de privacidad. Respetamos tu privacidad y jamás compartiremos tus datos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 