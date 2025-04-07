import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-playfair text-9xl font-bold text-[var(--color-primary)]">404</h1>
        <h2 className="font-playfair text-3xl font-medium text-gray-900 mt-4 mb-6">Página no encontrada</h2>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
          
          <Link 
            to="/contacto"
            className="px-6 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] font-medium rounded-lg transition-colors"
          >
            Contactar con soporte
          </Link>
        </div>
        
        <div className="mt-16">
          <p className="text-sm text-gray-500">
            ¿Buscas algo específico? Prueba estas categorías populares:
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link 
              to="/categoria/skincare" 
              className="inline-block px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-800 rounded-full border border-gray-200 transition-colors"
            >
              Cuidado facial
            </Link>
            <Link 
              to="/categoria/maquillaje" 
              className="inline-block px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-800 rounded-full border border-gray-200 transition-colors"
            >
              Maquillaje
            </Link>
            <Link 
              to="/categoria/cabello" 
              className="inline-block px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-800 rounded-full border border-gray-200 transition-colors"
            >
              Cuidado del cabello
            </Link>
            <Link 
              to="/categoria/fragancias" 
              className="inline-block px-4 py-2 text-sm bg-white hover:bg-gray-100 text-gray-800 rounded-full border border-gray-200 transition-colors"
            >
              Fragancias
            </Link>
          </div>
        </div>
      </div>
      
      {/* Imagen decorativa */}
      <div className="mt-12 max-w-md mx-auto">
        <img 
          src="/assets/images/404-illustration.svg" 
          alt="Ilustración página no encontrada" 
          className="w-full h-auto opacity-80"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default NotFoundPage; 