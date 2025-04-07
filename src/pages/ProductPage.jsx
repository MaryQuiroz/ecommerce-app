import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import products from '../data/products.json';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, addToWishlist } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [shadeOption, setShadeOption] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Encontrar el producto actual
    const currentProduct = products.find((p) => p.id === productId);
    
    if (currentProduct) {
      setProduct(currentProduct);
      
      // Si el producto tiene opciones de color/shade, seleccionar la primera
      if (currentProduct.shades && currentProduct.shades.length > 0) {
        setShadeOption(currentProduct.shades[0]);
      }
      
      // Buscar productos relacionados (misma categoría)
      const related = products
        .filter((p) => p.category === currentProduct.category && p.id !== productId)
        .slice(0, 4);
      
      setRelatedProducts(related);
    }
  }, [productId]);

  // Comprobar si el producto está en la lista de deseos del usuario
  useEffect(() => {
    if (user && product) {
      setIsInWishlist(user.wishlist.includes(product.id));
    } else {
      setIsInWishlist(false);
    }
  }, [user, product]);

  const handleAddToCart = () => {
    if (product) {
      const options = {};
      if (shadeOption) {
        options.shade = shadeOption;
      }

      addToCart(product, quantity, options);
      
      // Opcional: Mostrar una notificación o mensaje de éxito
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/carrito');
  };
  
  const handleAddToWishlist = () => {
    if (user) {
      addToWishlist(product.id);
      setIsInWishlist(true);
    } else {
      // Redirigir a la página de login si el usuario no está autenticado
      navigate('/iniciar-sesion');
    }
  };
  
  const handleQuantityChange = (newQty) => {
    // Asegurar que la cantidad esté entre 1 y el stock disponible
    const validQty = Math.max(1, Math.min(newQty, product?.stock || 10));
    setQuantity(validQty);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <p className="mb-8">Lo sentimos, el producto que buscas no existe o ha sido eliminado.</p>
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
        <Link to={`/categoria/${product.category}`} className="text-gray-500 hover:text-[var(--color-primary)]">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary)]">{product.name}</span>
      </div>
      
      {/* Product Detail */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="relative h-[400px] lg:h-[500px] mb-4 rounded-lg overflow-hidden">
              <img 
                src={product.images[currentImage]} 
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
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                    index === currentImage ? 'border-[var(--color-primary)]' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - Vista ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="font-playfair text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} reseñas)</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {product.discountPrice ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-[var(--color-primary-dark)]">${product.discountPrice}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">${product.price}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-[var(--color-primary-dark)]">${product.price}</span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-6">{product.longDescription}</p>
            
            {/* Options: Shades/Colors */}
            {product.shades && product.shades.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Tonos:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.shades.map((shade) => (
                    <button
                      key={shade}
                      onClick={() => setShadeOption(shade)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        shadeOption === shade
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {shade}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stock */}
            <div className="mb-6">
              <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Agotado'}
              </span>
            </div>
            
            {/* Quantity */}
            <div className="flex items-center mb-6">
              <span className="mr-3 font-medium">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-12 py-1 text-center border-x border-gray-300 focus:outline-none"
                  min="1"
                  max={product.stock}
                />
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-full transition-colors"
                disabled={product.stock <= 0}
              >
                Añadir al carrito
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-[var(--color-secondary-dark)] hover:bg-[var(--color-secondary)] text-white font-medium rounded-full transition-colors"
                disabled={product.stock <= 0}
              >
                Comprar ahora
              </button>
              <button 
                onClick={handleAddToWishlist}
                className={`w-12 h-12 flex items-center justify-center rounded-full border ${
                  isInWishlist
                    ? 'bg-red-100 border-red-300 text-red-500'
                    : 'border-gray-300 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex overflow-x-auto p-2">
            <button 
              onClick={() => setTab('description')}
              className={`whitespace-nowrap px-4 py-2 rounded-t-lg ${
                tab === 'description' 
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' 
                  : 'text-gray-600 hover:text-[var(--color-primary-dark)]'
              }`}
            >
              Descripción
            </button>
            <button 
              onClick={() => setTab('ingredients')}
              className={`whitespace-nowrap px-4 py-2 rounded-t-lg ${
                tab === 'ingredients' 
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' 
                  : 'text-gray-600 hover:text-[var(--color-primary-dark)]'
              }`}
            >
              Ingredientes
            </button>
            <button 
              onClick={() => setTab('howToUse')}
              className={`whitespace-nowrap px-4 py-2 rounded-t-lg ${
                tab === 'howToUse' 
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' 
                  : 'text-gray-600 hover:text-[var(--color-primary-dark)]'
              }`}
            >
              Modo de uso
            </button>
            <button 
              onClick={() => setTab('reviews')}
              className={`whitespace-nowrap px-4 py-2 rounded-t-lg ${
                tab === 'reviews' 
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' 
                  : 'text-gray-600 hover:text-[var(--color-primary-dark)]'
              }`}
            >
              Reseñas ({product.reviewCount})
            </button>
          </div>
          
          <div className="p-6">
            {tab === 'description' && (
              <div>
                <h3 className="font-playfair text-xl font-medium mb-4">Descripción del producto</h3>
                <p className="text-gray-600 whitespace-pre-line">{product.longDescription}</p>
              </div>
            )}
            
            {tab === 'ingredients' && (
              <div>
                <h3 className="font-playfair text-xl font-medium mb-4">Ingredientes</h3>
                <p className="text-gray-600 whitespace-pre-line">{product.ingredients}</p>
              </div>
            )}
            
            {tab === 'howToUse' && (
              <div>
                <h3 className="font-playfair text-xl font-medium mb-4">Modo de uso</h3>
                <p className="text-gray-600 whitespace-pre-line">{product.howToUse}</p>
              </div>
            )}
            
            {tab === 'reviews' && (
              <div>
                <h3 className="font-playfair text-xl font-medium mb-6">Reseñas de clientes</h3>
                
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay reseñas disponibles para este producto.</p>
                )}
                
                <div className="mt-8">
                  <h4 className="font-medium mb-4">Escribir una reseña</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Debes estar{' '}
                    <Link to="/iniciar-sesion" className="text-[var(--color-primary)] hover:underline">
                      registrado
                    </Link>{' '}
                    y haber comprado este producto para dejar una reseña.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-playfair text-2xl font-bold mb-8">Productos relacionados</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg overflow-hidden shadow-sm group hover-scale">
                <Link to={`/producto/${relatedProduct.id}`} className="block relative h-64 overflow-hidden">
                  <img 
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                </Link>
                
                <div className="p-4">
                  <Link to={`/producto/${relatedProduct.id}`}>
                    <h3 className="font-medium text-gray-800 mb-1 hover:text-[var(--color-primary)]">{relatedProduct.name}</h3>
                  </Link>
                  
                  <div className="flex justify-between items-center">
                    {relatedProduct.discountPrice ? (
                      <div>
                        <span className="font-semibold text-[var(--color-primary-dark)]">${relatedProduct.discountPrice}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${relatedProduct.price}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-[var(--color-primary-dark)]">${relatedProduct.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage; 