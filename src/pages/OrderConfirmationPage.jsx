import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    // Si el usuario está autenticado, buscar el pedido en sus pedidos
    if (isAuthenticated && user) {
      const userOrder = user.orders.find(o => o.id === orderId);
      if (userOrder) {
        setOrder(userOrder);
      }
    }
    
    // Si no hay orderId o no se encuentra el pedido, podemos crear uno ficticio para la demo
    if (!orderId) {
      navigate('/');
    } else if (!order) {
      // Datos de ejemplo para mostrar en la confirmación
      setOrder({
        id: orderId,
        date: new Date().toISOString(),
        status: 'procesando',
        items: [],
        subtotal: '0.00',
        shipping: '0.00',
        tax: '0.00',
        total: '0.00',
        shippingAddress: {
          firstName: 'Usuario',
          lastName: 'Demo',
          address: 'Calle Principal 123',
          city: 'Madrid',
          state: 'Madrid',
          zip: '28001',
          country: 'España',
        },
        paymentMethod: 'credit-card',
      });
    }
  }, [orderId, isAuthenticated, user, navigate, order]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Formatear fecha
  const orderDate = new Date(order.date);
  const formattedDate = orderDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  // Calcular fecha estimada de entrega (5 días laborables)
  const estimatedDeliveryDate = new Date(orderDate);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);
  const formattedDeliveryDate = estimatedDeliveryDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-[var(--color-primary)]">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary)]">Confirmación de pedido</span>
      </div>
      
      {/* Order confirmation */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold mb-2">¡Gracias por tu pedido!</h1>
            <p className="text-gray-600">Tu pedido ha sido recibido y está siendo procesado.</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="font-medium text-lg mb-3">Información del pedido</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Número de pedido:</div>
                  <div className="font-medium">{order.id}</div>
                </div>
                
                <div>
                  <div className="text-gray-600 mb-1">Fecha del pedido:</div>
                  <div className="font-medium">{formattedDate}</div>
                </div>
                
                <div>
                  <div className="text-gray-600 mb-1">Estado del pedido:</div>
                  <div className="font-medium capitalize">
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-600 mb-1">Entrega estimada:</div>
                  <div className="font-medium">{formattedDeliveryDate}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="font-medium text-lg mb-3">Detalles de envío</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Dirección de envío:</div>
                  <div className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.zip}, {order.shippingAddress.city}<br />
                    {order.shippingAddress.state}, {order.shippingAddress.country}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-600 mb-1">Método de pago:</div>
                  <div className="font-medium capitalize">
                    {order.paymentMethod === 'credit-card' ? 'Tarjeta de crédito' : order.paymentMethod}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order items */}
            {order.items && order.items.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="font-medium text-lg mb-3">Productos pedidos</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600 border-b border-gray-200">
                        <th className="pb-2">Producto</th>
                        <th className="pb-2 text-center">Cantidad</th>
                        <th className="pb-2 text-right">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-3">
                            <div className="flex items-center">
                              {item.images && (
                                <div className="w-12 h-12 mr-3 rounded overflow-hidden">
                                  <img 
                                    src={item.images[0]} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{item.name}</div>
                                {item.options && Object.keys(item.options).length > 0 && (
                                  <div className="text-xs text-gray-500">
                                    {Object.entries(item.options).map(([key, value]) => (
                                      <span key={key} className="capitalize">{key}: {value}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="text-sm border-t border-gray-200">
                        <td colSpan="2" className="pt-4 text-right">Subtotal:</td>
                        <td className="pt-4 text-right font-medium">${order.subtotal}</td>
                      </tr>
                      <tr className="text-sm">
                        <td colSpan="2" className="py-1 text-right">Envío:</td>
                        <td className="py-1 text-right">${order.shipping}</td>
                      </tr>
                      <tr className="text-sm">
                        <td colSpan="2" className="py-1 text-right">Impuestos:</td>
                        <td className="py-1 text-right">${order.tax}</td>
                      </tr>
                      <tr className="text-sm font-bold">
                        <td colSpan="2" className="pt-3 text-right">Total:</td>
                        <td className="pt-3 text-right">${order.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors text-center">
            Continuar comprando
          </Link>
          
          {isAuthenticated && (
            <Link to="/perfil/pedidos" className="px-6 py-3 border border-[var(--color-primary)] text-[var(--color-primary-dark)] rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-colors text-center">
              Ver mis pedidos
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 