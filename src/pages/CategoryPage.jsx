import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import categories from '../data/categories.json';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sorting, setSorting] = useState('featured');
  const [filters, setFilters] = useState({
    isNew: false,
    isBestSeller: false,
    inStock: false,
    hasDiscount: false
  });

  useEffect(() => {
    // Encontrar la categoría actual
    const category = categoryId === 'todos' 
      ? { id: 'todos', name: 'Todos los productos', description: 'Explora nuestra colección completa de productos.' }
      : categories.find(cat => cat.id === categoryId);
    
    setCurrentCategory(category);

    // Filtrar productos
    let filtered = categoryId === 'todos' 
      ? [...products] 
      : products.filter(product => product.category === categoryId);
    
    // Aplicar filtros adicionales
    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew);
    }
    
    if (filters.isBestSeller) {
      filtered = filtered.filter(product => product.isBestSeller);
    }
    
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    
    if (filters.hasDiscount) {
      filtered = filtered.filter(product => product.discountPrice);
    }
    
    // Filtrar por rango de precio
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Ordenar productos
    switch (sorting) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
        break;
      default:
        // Por defecto, featured (destacados primero)
        filtered.sort((a, b) => (a.isBestSeller === b.isBestSeller) ? 0 : a.isBestSeller ? -1 : 1);
    }

    setFilteredProducts(filtered);
  }, [categoryId, sorting, filters, priceRange]);

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSortChange = (e) => {
    setSorting(e.target.value);
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = Number(e.target.value);
    setPriceRange(newRange);
  };

  // Si no existe la categoría, mostrar un mensaje
  if (!currentCategory) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Categoría no encontrada</h1>
        <p className="mb-8">Lo sentimos, la categoría que buscas no existe.</p>
        <Link to="/" className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-[var(--color-primary)]">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary)]">{currentCategory.name}</span>
      </div>
      
      {/* Encabezado de categoría */}
      <div className="mb-10">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">{currentCategory.name}</h1>
        <p className="text-gray-600">{currentCategory.description}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-lg mb-4">Filtros</h3>
            
            {/* Filtros de estado */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Estado</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="isNew" 
                    checked={filters.isNew}
                    onChange={handleFilterChange}
                    className="rounded text-[var(--color-primary)]" 
                  />
                  <span>Novedades</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="isBestSeller" 
                    checked={filters.isBestSeller}
                    onChange={handleFilterChange} 
                    className="rounded text-[var(--color-primary)]" 
                  />
                  <span>Más vendidos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="inStock" 
                    checked={filters.inStock}
                    onChange={handleFilterChange} 
                    className="rounded text-[var(--color-primary)]" 
                  />
                  <span>En stock</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="hasDiscount" 
                    checked={filters.hasDiscount}
                    onChange={handleFilterChange} 
                    className="rounded text-[var(--color-primary)]" 
                  />
                  <span>En oferta</span>
                </label>
              </div>
            </div>
            
            {/* Filtro de precio */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Rango de precio</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={priceRange[0]} 
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full" 
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={priceRange[1]} 
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full" 
                  />
                </div>
              </div>
            </div>
            
            {/* Resetear filtros */}
            <button 
              onClick={() => {
                setFilters({
                  isNew: false,
                  isBestSeller: false,
                  inStock: false,
                  hasDiscount: false
                });
                setPriceRange([0, 100]);
              }}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Resetear filtros
            </button>
          </div>
        </div>
        
        {/* Lista de productos */}
        <div className="flex-1">
          {/* Cabecera con ordernación y contador */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <p className="mb-3 sm:mb-0">{filteredProducts.length} productos encontrados</p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-gray-600">Ordenar por:</label>
              <select 
                id="sort" 
                value={sorting} 
                onChange={handleSortChange}
                className="border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="featured">Destacados</option>
                <option value="newest">Más recientes</option>
                <option value="price-asc">Precio: Menor a mayor</option>
                <option value="price-desc">Precio: Mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>
          
          {/* Grid de productos */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm group hover-scale">
                  <Link to={`/producto/${product.id}`} className="block relative h-64 overflow-hidden">
                    <img 
                      src={product.images[0]}
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badge de novedad o descuento */}
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded-full">
                        Nuevo
                      </span>
                    )}
                    
                    {product.discountPrice && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {Math.round((1 - product.discountPrice / product.price) * 100)}% dto.
                      </span>
                    )}
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs ml-1 text-gray-600">({product.reviewCount})</span>
                    </div>
                    
                    <Link to={`/producto/${product.id}`}>
                      <h3 className="font-medium text-gray-800 mb-1 hover:text-[var(--color-primary)]">{product.name}</h3>
                    </Link>
                    
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      {product.discountPrice ? (
                        <div className="flex items-baseline">
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
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">No hay productos para mostrar</h3>
              <p className="text-gray-500 mb-6">Intenta ajustar tus filtros o selecciona otra categoría.</p>
              <button 
                onClick={() => {
                  setFilters({
                    isNew: false,
                    isBestSeller: false,
                    inStock: false,
                    hasDiscount: false
                  });
                  setPriceRange([0, 100]);
                }}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Resetear filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 