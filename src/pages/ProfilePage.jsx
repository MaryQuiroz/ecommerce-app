import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componentes para las diferentes secciones del perfil
const ProfileInfo = ({ user, updateProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) {
      errors.name = 'El nombre es requerido';
    }
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Actualizar perfil
    updateProfile({
      name: formData.name,
      email: formData.email,
    });
    
    setIsEditing(false);
    setSuccessMessage('Perfil actualizado correctamente');
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="font-playfair text-xl font-medium mb-6">Información personal</h2>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              } ${!isEditing ? 'bg-gray-50' : ''}`}
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-3">
            <button 
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors"
            >
              Guardar cambios
            </button>
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-lg transition-colors"
          >
            Editar perfil
          </button>
        )}
      </form>
    </div>
  );
};

const AddressBook = ({ user, addAddress, updateAddress, removeAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'España',
    isDefault: false,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['name', 'street', 'city', 'state', 'zip', 'country'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'Este campo es requerido';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddNew = () => {
    setIsAddingNew(true);
    setCurrentAddress(null);
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'España',
      isDefault: false,
    });
    setFormErrors({});
    setSuccessMessage('');
  };
  
  const handleEdit = (address) => {
    setIsAddingNew(true);
    setCurrentAddress(address);
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setSuccessMessage('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (currentAddress) {
      // Actualizar dirección existente
      const updatedAddress = {
        ...currentAddress,
        ...formData,
      };
      updateAddress(updatedAddress);
      
      setSuccessMessage('Dirección actualizada correctamente');
    } else {
      // Añadir nueva dirección
      addAddress(formData);
      
      setSuccessMessage('Dirección añadida correctamente');
    }
    
    setIsAddingNew(false);
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleRemove = (addressId) => {
    if (window.confirm('¿Estás seguro de eliminar esta dirección?')) {
      removeAddress(addressId);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-xl font-medium">Mis direcciones</h2>
        
        {!isAddingNew && (
          <button 
            onClick={handleAddNew}
            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors"
          >
            Añadir dirección
          </button>
        )}
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          {successMessage}
        </div>
      )}
      
      {isAddingNew ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la dirección *</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Casa, Trabajo, etc."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
              <input 
                type="text" 
                id="street" 
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                  formErrors.street ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.street && (
                <p className="mt-1 text-xs text-red-600">{formErrors.street}</p>
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
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="rounded text-[var(--color-primary)]"
                />
                <span className="ml-2 text-sm text-gray-700">Establecer como dirección por defecto</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors"
            >
              {currentAddress ? 'Actualizar dirección' : 'Añadir dirección'}
            </button>
            <button 
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div>
          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`border ${address.isDefault ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200'} rounded-lg p-4`}
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">{address.name}</span>
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">
                          Por defecto
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(address)}
                        className="text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleRemove(address.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{address.street}</p>
                    <p>{address.zip}, {address.city}</p>
                    <p>{address.state}, {address.country}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mb-4">No tienes direcciones guardadas</p>
              <button 
                onClick={handleAddNew}
                className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors"
              >
                Añadir primera dirección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (user && user.orders) {
      // Ordenar pedidos por fecha (más recientes primero)
      const sortedOrders = [...user.orders].sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    }
  }, [user]);
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  // Obtener el estado en español
  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
      case 'procesando':
        return 'Procesando';
      case 'shipped':
      case 'enviado':
        return 'Enviado';
      case 'delivered':
      case 'entregado':
        return 'Entregado';
      case 'cancelled':
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  // Obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
      case 'procesando':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="font-playfair text-xl font-medium mb-6">Historial de pedidos</h2>
      
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                <th className="pb-3">Pedido</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="text-sm">
                  <td className="py-3 font-medium">{order.id}</td>
                  <td className="py-3">{formatDate(order.date)}</td>
                  <td className="py-3">${order.total}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link 
                      to={`/confirmacion-pedido/${order.id}`}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="mb-4">No tienes pedidos realizados</p>
          <Link 
            to="/"
            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors"
          >
            Ir a comprar
          </Link>
        </div>
      )}
    </div>
  );
};

const Wishlist = ({ user, removeFromWishlist }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Cargar los productos
    const fetchProducts = async () => {
      try {
        const response = await import('../data/products.json');
        setProducts(response.default || []);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (user && user.wishlist && products.length > 0) {
      // Filtrar productos en la lista de deseos
      const items = products.filter(product => user.wishlist.includes(product.id));
      setWishlistItems(items);
    }
  }, [user, products]);
  
  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="font-playfair text-xl font-medium mb-6">Mi lista de deseos</h2>
      
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden group hover-scale">
              <Link to={`/producto/${product.id}`} className="block relative h-48 overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </Link>
              
              <div className="p-4">
                <Link to={`/producto/${product.id}`}>
                  <h3 className="font-medium text-gray-800 mb-1 hover:text-[var(--color-primary)]">{product.name}</h3>
                </Link>
                
                <div className="flex justify-between items-center mt-2">
                  {product.discountPrice ? (
                    <div className="flex items-baseline">
                      <span className="font-semibold text-[var(--color-primary-dark)]">${product.discountPrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${product.price}</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-[var(--color-primary-dark)]">${product.price}</span>
                  )}
                  
                  <button 
                    onClick={() => handleRemove(product.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="mb-4">Tu lista de deseos está vacía</p>
          <Link 
            to="/"
            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors"
          >
            Descubrir productos
          </Link>
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, updateProfile, logout, addAddress, updateAddress, removeAddress, removeFromWishlist } = useAuth();
  
  const [activeTab, setActiveTab] = useState('info');
  
  useEffect(() => {
    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      navigate('/iniciar-sesion');
    }
    
    // Establecer pestaña activa según la URL
    const path = location.pathname.split('/');
    if (path.length > 2) {
      const tab = path[2];
      setActiveTab(tab);
    } else {
      setActiveTab('info');
    }
  }, [isAuthenticated, navigate, location]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/perfil/${tab}`);
  };
  
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
      navigate('/');
    }
  };
  
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-[var(--color-primary)]">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary)]">Mi cuenta</span>
      </div>
      
      <h1 className="font-playfair text-3xl font-bold mb-8">Mi cuenta</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-primary)]/10">
                <img src={user.avatar || 'https://randomuser.me/api/portraits/women/44.jpg'} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button 
                onClick={() => handleTabChange('info')}
                className={`w-full px-4 py-2 rounded-lg text-left ${
                  activeTab === 'info'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Información personal
              </button>
              <button 
                onClick={() => handleTabChange('direcciones')}
                className={`w-full px-4 py-2 rounded-lg text-left ${
                  activeTab === 'direcciones'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Direcciones
              </button>
              <button 
                onClick={() => handleTabChange('pedidos')}
                className={`w-full px-4 py-2 rounded-lg text-left ${
                  activeTab === 'pedidos'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mis pedidos
              </button>
              <button 
                onClick={() => handleTabChange('wishlist')}
                className={`w-full px-4 py-2 rounded-lg text-left ${
                  activeTab === 'wishlist'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Lista de deseos
              </button>
            </nav>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<ProfileInfo user={user} updateProfile={updateProfile} />} />
            <Route path="/info" element={<ProfileInfo user={user} updateProfile={updateProfile} />} />
            <Route path="/direcciones" element={<AddressBook user={user} addAddress={addAddress} updateAddress={updateAddress} removeAddress={removeAddress} />} />
            <Route path="/pedidos" element={<OrderHistory user={user} />} />
            <Route path="/wishlist" element={<Wishlist user={user} removeFromWishlist={removeFromWishlist} />} />
          </Routes>
          
          {/* Mobile-only: Show active tab content */}
          <div className="lg:hidden">
            {activeTab === 'info' && <ProfileInfo user={user} updateProfile={updateProfile} />}
            {activeTab === 'direcciones' && <AddressBook user={user} addAddress={addAddress} updateAddress={updateAddress} removeAddress={removeAddress} />}
            {activeTab === 'pedidos' && <OrderHistory user={user} />}
            {activeTab === 'wishlist' && <Wishlist user={user} removeFromWishlist={removeFromWishlist} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 