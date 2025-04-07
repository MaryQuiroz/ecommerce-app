import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, addOrder } = useAuth();
  
  // Estados del formulario de pago
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'España',
    saveAddress: false,
    
    // Datos de pago
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    
    // Método de envío
    shippingMethod: 'standard',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Cálculos de costos
  const subtotal = totalPrice;
  const shipping = formData.shippingMethod === 'express' ? 9.99 : 5.99;
  const tax = (subtotal * 0.21).toFixed(2); // 21% IVA
  const total = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);

  // Si el usuario está autenticado, prellenar con sus datos
  useEffect(() => {
    if (isAuthenticated && user) {
      // Si el usuario tiene una dirección por defecto, usar esa
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      
      if (defaultAddress) {
        setFormData(prev => ({
          ...prev,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ').slice(1).join(' '),
          email: user.email,
          address: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zip: defaultAddress.zip,
          country: defaultAddress.country,
        }));
      } else {
        // Si no tiene una dirección por defecto, solo prellenar nombre y email
        setFormData(prev => ({
          ...prev,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ').slice(1).join(' '),
          email: user.email,
        }));
      }
    }
  }, [isAuthenticated, user]);
  
  // Si el carrito está vacío, redirigir a la página del carrito
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/carrito');
    }
  }, [items, navigate, orderPlaced]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error al cambiar el campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validar campos requeridos
    const requiredFields = [
      'firstName', 'lastName', 'email', 'address', 
      'city', 'state', 'zip', 'country', 
      'cardName', 'cardNumber', 'cardExpiry', 'cardCvc'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'Este campo es requerido';
      }
    });
    
    // Validaciones adicionales
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    
    if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Número de tarjeta no válido';
    }
    
    if (formData.cardExpiry && !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      errors.cardExpiry = 'Formato de fecha no válido (MM/YY)';
    }
    
    if (formData.cardCvc && !/^\d{3,4}$/.test(formData.cardCvc)) {
      errors.cardCvc = 'Código de seguridad no válido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }
    
    // Simulación de procesamiento de pedido
    const newOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    
    // Crear objeto de pedido
    const order = {
      id: newOrderId,
      items: [...items],
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      paymentMethod: 'credit-card',
      status: 'procesando',
      date: new Date().toISOString(),
    };
    
    // Si el usuario está autenticado, guardar el pedido
    if (isAuthenticated) {
      addOrder(order);
    }
    
    // Establecer estado del pedido completado
    setOrderId(newOrderId);
    setOrderPlaced(true);
    
    // Limpiar carrito
    clearCart();
    
    // Redirigir a la página de confirmación
    navigate(`/confirmacion-pedido/${newOrderId}`);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="font-playfair text-2xl font-bold mb-4">No hay artículos en el carrito</h1>
          <p className="text-gray-600 mb-8">Agrega productos a tu carrito antes de proceder al pago.</p>
          <Link to="/" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors">
            Ver productos
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
        <Link to="/carrito" className="text-gray-500 hover:text-[var(--color-primary)]">Carrito</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary)]">Pago</span>
      </div>
      
      <h1 className="font-playfair text-3xl font-bold mb-8">Finalizar compra</h1>
      
      {/* Checkout form */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Checkout form */}
          <div className="flex-1">
            {/* Error summary */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-red-800 font-medium mb-2">Por favor corrige los siguientes errores:</h3>
                <ul className="list-disc pl-5 text-sm text-red-600">
                  {Object.values(formErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          
            {/* Shipping address */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="font-playfair text-xl font-medium mb-4">Datos de envío</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input 
                    type="text" 
                    id="address" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.state}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">Código postal *</label>
                  <input 
                    type="text" 
                    id="zip" 
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.zip ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.zip && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.zip}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">País *</label>
                  <select 
                    id="country" 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                      formErrors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="España">España</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Francia">Francia</option>
                    <option value="Italia">Italia</option>
                    <option value="Alemania">Alemania</option>
                  </select>
                  {formErrors.country && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.country}</p>
                  )}
                </div>
              </div>
              
              {isAuthenticated && (
                <div className="mt-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="saveAddress"
                      checked={formData.saveAddress}
                      onChange={handleChange}
                      className="rounded text-[var(--color-primary)]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Guardar esta dirección para futuras compras</span>
                  </label>
                </div>
              )}
            </div>
            
            {/* Payment method */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="font-playfair text-xl font-medium mb-4">Método de pago</h2>
              
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex space-x-2">
                    <img src="https://www.svgrepo.com/show/328132/visa.svg" alt="Visa" className="h-8" />
                    <img src="https://www.svgrepo.com/show/328121/mastercard.svg" alt="MasterCard" className="h-8" />
                    <img src="https://www.svgrepo.com/show/328069/american-express.svg" alt="Amex" className="h-8" />
                  </div>
                  <span className="text-sm text-gray-600">Pagos seguros con cifrado SSL</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta *</label>
                    <input 
                      type="text" 
                      id="cardName" 
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Como aparece en la tarjeta"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        formErrors.cardName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cardName && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.cardName}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta *</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cardNumber && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración *</label>
                    <input 
                      type="text" 
                      id="cardExpiry" 
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        formErrors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cardExpiry && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.cardExpiry}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">CVC/CVV *</label>
                    <input 
                      type="text" 
                      id="cardCvc" 
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      placeholder="123"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        formErrors.cardCvc ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cardCvc && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.cardCvc}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-playfair text-xl font-medium mb-4">Método de envío</h2>
              
              <div className="space-y-3">
                <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                  <input 
                    type="radio" 
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleChange}
                    className="mt-1 text-[var(--color-primary)]"
                  />
                  <div className="ml-3">
                    <span className="block font-medium">Estándar (2-4 días laborables)</span>
                    <span className="block text-sm text-gray-600 mt-1">€5.99</span>
                  </div>
                </label>
                
                <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                  <input 
                    type="radio" 
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleChange}
                    className="mt-1 text-[var(--color-primary)]"
                  />
                  <div className="ml-3">
                    <span className="block font-medium">Express (1-2 días laborables)</span>
                    <span className="block text-sm text-gray-600 mt-1">€9.99</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Right column: Order summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="font-playfair text-xl font-medium mb-4">Resumen del pedido</h2>
              
              {/* Products summary */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{totalItems} productos</span>
                  <Link to="/carrito" className="text-[var(--color-primary)] hover:underline">Editar</Link>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${JSON.stringify(item.options)}`} className="flex gap-3">
                      <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        {/* Options */}
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(item.options).map(([key, value]) => (
                              <span key={key} className="capitalize">{key}: {value}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cost summary */}
              <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío ({formData.shippingMethod === 'express' ? 'Express' : 'Estándar'})</span>
                  <span>${shipping}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos (21% IVA)</span>
                  <span>${tax}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold mb-6">
                <span>Total</span>
                <span>${total}</span>
              </div>
              
              <button 
                type="submit"
                className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-full transition-colors"
              >
                Completar pedido
              </button>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Al completar tu pedido, aceptas nuestros <Link to="/terminos" className="text-[var(--color-primary)] hover:underline">Términos y condiciones</Link> y <Link to="/privacidad" className="text-[var(--color-primary)] hover:underline">Política de privacidad</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage; 