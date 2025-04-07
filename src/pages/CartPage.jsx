import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // Cálculos de costos
  const shipping = totalPrice > 0 ? 5.99 : 0;
  const discount = promoApplied ? discountAmount : 0;
  const subtotal = totalPrice;
  const total = subtotal + shipping - discount;

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity, item.options);
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id, item.options);
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
      clearCart();
    }
  };

  const handlePromoCode = () => {
    // Validar código promocional (simulado)
    if (promoCode.toLowerCase() === 'bella10') {
      const discountValue = subtotal * 0.1; // 10% de descuento
      setDiscountAmount(parseFloat(discountValue.toFixed(2)));
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === 'free-shipping') {
      // Código para envío gratis
      setDiscountAmount(shipping);
      setPromoApplied(true);
    } else {
      alert('Código promocional no válido');
      setPromoApplied(false);
      setDiscountAmount(0);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 className="font-playfair text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Parece que aún no has añadido productos a tu carrito.</p>
          <Link to="/" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors">
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-[var(--color-primary)]">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary)]">Carrito</span>
      </div>
      
      <h1 className="font-playfair text-3xl font-bold mb-8">Tu carrito</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-6">
                <span className="font-medium">Producto</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium">Precio</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium">Cantidad</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="font-medium">Total</span>
              </div>
            </div>
            
            {/* Cart items */}
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.options)}`} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col">
                  {/* Product info */}
                  <div className="md:col-span-6 flex gap-4 mb-4 md:mb-0">
                    <Link to={`/producto/${item.id}`} className="shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className="w-full h-full object-cover" 
                      />
                    </Link>
                    <div>
                      <Link to={`/producto/${item.id}`} className="font-medium text-gray-800 hover:text-[var(--color-primary)]">
                        {item.name}
                      </Link>
                      
                      {/* Options */}
                      {item.options && Object.keys(item.options).length > 0 && (
                        <div className="mt-1 text-sm text-gray-500">
                          {Object.entries(item.options).map(([key, value]) => (
                            <div key={key}>
                              <span className="capitalize">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Mobile price */}
                      <div className="md:hidden mt-2 flex justify-between">
                        <span className="text-sm font-medium">Precio:</span>
                        <span>${item.price}</span>
                      </div>
                      
                      {/* Remove button */}
                      <button 
                        onClick={() => handleRemoveItem(item)}
                        className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="md:col-span-2 hidden md:flex justify-center">
                    <span>${item.price}</span>
                  </div>
                  
                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-center md:justify-center my-4 md:my-0">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                        className="w-10 py-1 text-center border-x border-gray-300 focus:outline-none"
                        min="1"
                      />
                      <button 
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="md:col-span-2 flex md:justify-end">
                    <div className="md:hidden font-medium mr-2">Total:</div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cart actions */}
            <div className="flex justify-between p-4 border-t border-gray-200 bg-gray-50">
              <Link to="/" className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                ← Continuar comprando
              </Link>
              <button 
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-playfair text-xl font-bold mb-4">Resumen del pedido</h2>
            
            {/* Promo code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Código promocional" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button 
                  onClick={handlePromoCode}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Aplicar
                </button>
              </div>
              
              {promoApplied && (
                <div className="mt-2 text-green-600 text-sm">
                  ¡Código aplicado!
                </div>
              )}
            </div>
            
            {/* Cost summary */}
            <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} productos)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between font-bold mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-full transition-colors"
            >
              Proceder al pago
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Los impuestos se calcularán en el pago.</p>
              <p className="mt-2">Aceptamos todas las principales tarjetas de crédito y PayPal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 