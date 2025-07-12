"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CookiesBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    // Here you can also enable analytics/tracking scripts
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🍪</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Utilizamos cookies para mejorar tu experiencia
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Utilizamos cookies propias y de terceros para analizar el tráfico del sitio web, 
                  personalizar el contenido y los anuncios, y para ofrecer funciones de redes sociales.
                </p>
                
                {showDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-3 text-sm text-gray-700">
                    <h4 className="font-semibold mb-2">Tipos de cookies que utilizamos:</h4>
                    <ul className="space-y-1 text-xs">
                      <li><strong>Cookies necesarias:</strong> Esenciales para el funcionamiento del sitio web.</li>
                      <li><strong>Cookies de análisis:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio.</li>
                      <li><strong>Cookies de marketing:</strong> Se utilizan para hacer un seguimiento de los visitantes en los sitios web.</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      Puedes obtener más información en nuestra{' '}
                      <a 
                        href="/privacy-policy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#7f6d2a] hover:underline font-medium"
                      >
                        Política de Privacidad
                      </a>
                      {' '}y{' '}
                      <a 
                        href="/cookies-policy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#7f6d2a] hover:underline font-medium"
                      >
                        Política de Cookies
                      </a>
                      .
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[#7f6d2a] hover:underline text-sm font-medium"
                >
                  {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleAcceptAll}
              className="bg-[#7f6d2a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors whitespace-nowrap"
            >
              Aceptar todas
            </button>
            <button
              onClick={handleAcceptNecessary}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              Solo necesarias
            </button>
            <button
              onClick={handleDecline}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Rechazar
            </button>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 lg:relative lg:top-0 lg:right-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 