
"use client";

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, StarIcon, LinkIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { WhatsAppButton } from "../../components/WhatsAppButton";
import CookiesBanner from "../../components/CookiesBanner";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleReviewLinkGenerator() {
  const [formData, setFormData] = useState({
    businessName: '',
    postcode: '',
    businessCountry: 'España',
    email: ''
  });
  
  // Business search states
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<'none' | 'confirmed' | 'rejected'>('none');
  
  // Link generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBusiness = () => {
    if (!formData.businessName || !formData.postcode) return;

    setIsSearching(true);
    setSearchError(null);
    setUserFeedback('none');
    setSelectedPlace(null);

    const searchTimeout = setTimeout(() => {
      setIsSearching(false);
      setSearchError('Búsqueda agotada. Por favor, inténtalo de nuevo.');
    }, 10000);

    const performSearch = () => {
      try {
        if (mapRef.current) {
          const newMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.4168, lng: -3.7038 },
            zoom: 2,
          });
          setMap(newMap);

          const placesService = new window.google.maps.places.PlacesService(newMap);
          const searchQuery = `${formData.businessName} ${formData.postcode} ${formData.businessCountry}`;
          const request = {
            query: searchQuery,
            fields: ['name', 'geometry', 'place_id', 'formatted_address'],
          };

          placesService.textSearch(request, (results: any[], status: string) => {
            clearTimeout(searchTimeout);
            setIsSearching(false);
            
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
              const place = results[0];
              setSelectedPlace(place);

              newMap.setCenter(place.geometry.location);
              newMap.setZoom(15);

              if (marker) {
                marker.setMap(null);
              }
              const newMarker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: newMap,
                title: place.name,
              });
              setMarker(newMarker);
            } else {
              setSearchError('No se encontró el negocio. Por favor, verifica el nombre y código postal.');
            }
          });
        }
      } catch (error) {
        clearTimeout(searchTimeout);
        setIsSearching(false);
        setSearchError('Error al buscar el negocio. Por favor, inténtalo de nuevo.');
        console.error('Search error:', error);
      }
    };

    if (window.google && window.google.maps) {
      performSearch();
    } else {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        window.initMap = () => {
          try {
            performSearch();
          } catch (error) {
            clearTimeout(searchTimeout);
            setIsSearching(false);
            setSearchError('Error al cargar Google Maps. Por favor, inténtalo de nuevo.');
          }
        };
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          clearTimeout(searchTimeout);
          setIsSearching(false);
          setSearchError('Error al cargar Google Maps. Verifica tu conexión a internet.');
        };
        document.head.appendChild(script);
        window.initMap = () => {
          try {
            performSearch();
          } catch (error) {
            clearTimeout(searchTimeout);
            setIsSearching(false);
            setSearchError('Error al cargar Google Maps. Por favor, inténtalo de nuevo.');
          }
        };
      }
    }
  };

  const handleBusinessConfirmation = (confirmed: boolean) => {
    setUserFeedback(confirmed ? 'confirmed' : 'rejected');
  };

  const generateReviewLink = async () => {
    if (!selectedPlace || !formData.email || userFeedback !== 'confirmed') {
      setError('Por favor, confirma tu negocio y proporciona tu email.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate the Google Review URL
      const reviewUrl = `https://search.google.com/local/writereview?placeid=${selectedPlace.place_id}`;
      
      // Create experience via tools.just5stars.com API
      const response = await fetch('https://tools.just5stars.com/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Enlace de Reseñas - ${selectedPlace.name}`,
          type: 'redirect',
          primary_url: reviewUrl,
          customer_email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el enlace de reseñas');
      }

      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const shortLink = `https://tools.just5stars.com/${result.data[0].short_id}`;
        setGeneratedLink(shortLink);
        setLinkSent(true);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }

    } catch (error) {
      console.error('Error generating review link:', error);
      setError('Error al generar el enlace. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      businessName: '',
      postcode: '',
      businessCountry: 'España',
      email: ''
    });
    setSelectedPlace(null);
    setUserFeedback('none');
    setGeneratedLink(null);
    setLinkSent(false);
    setError(null);
    setSearchError(null);
  };

  return (
    <>
      <main>
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <LinkIcon className="w-4 h-4 mr-2" />
              Herramienta Gratuita
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Generador de Enlaces de
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reseñas de Google
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Crea un enlace directo para que tus clientes puedan dejar reseñas en Google de forma rápida y sencilla. 
              Solo necesitas el nombre de tu negocio y código postal.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Busca tu negocio</h3>
                <p className="text-sm text-gray-600 text-center">Introduce el nombre y código postal</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Confirma</h3>
                <p className="text-sm text-gray-600 text-center">Verifica que es tu negocio</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Recibe tu enlace</h3>
                <p className="text-sm text-gray-600 text-center">Te enviamos el enlace por email</p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Generar Enlace de Reseñas
              </h2>
              
              <div className="space-y-6">
                {/* Business Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Negocio *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre de tu negocio"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="28001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value={formData.businessCountry}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessCountry: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="España"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (para enviarte el enlace) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={searchBusiness}
                  disabled={!formData.businessName || !formData.postcode || isSearching}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                      Buscar Negocio
                    </>
                  )}
                </button>

                {/* Search Error */}
                {searchError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{searchError}</p>
                  </div>
                )}

                {/* Map */}
                {(isSearching || selectedPlace) && (
                  <div className="space-y-4">
                    <div ref={mapRef} className="w-full h-64 rounded-lg border" />
                    
                    {selectedPlace && userFeedback === 'none' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-800 mb-2">{selectedPlace.name}</h5>
                        <p className="text-sm text-blue-600 mb-4">{selectedPlace.formatted_address}</p>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleBusinessConfirmation(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Sí, es mi negocio
                          </button>
                          <button
                            onClick={() => handleBusinessConfirmation(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            No es mi negocio
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {userFeedback === 'confirmed' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-green-800 mb-1">¡Perfecto!</h5>
                            <p className="text-sm text-green-600">Negocio confirmado: {selectedPlace.name}</p>
                          </div>
                          <button
                            onClick={() => setUserFeedback('none')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {userFeedback === 'rejected' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-800 mb-2">Intenta con otros términos</h5>
                        <p className="text-sm text-yellow-700">
                          Modifica el nombre del negocio o código postal para obtener mejores resultados.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Generate Link Button */}
                {userFeedback === 'confirmed' && formData.email && (
                  <button
                    onClick={generateReviewLink}
                    disabled={isGenerating}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generando enlace...
                      </>
                    ) : (
                      <>
                        <StarIcon className="w-5 h-5 mr-2" />
                        Generar Enlace de Reseñas
                      </>
                    )}
                  </button>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Success */}
                {generatedLink && linkSent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CheckIcon className="w-6 h-6 text-green-600 mr-2" />
                      <h5 className="font-semibold text-green-800">¡Enlace generado exitosamente!</h5>
                    </div>
                    
                    <p className="text-sm text-green-700 mb-4">
                      Hemos enviado el enlace a tu email: <strong>{formData.email}</strong>
                    </p>
                    
                    <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tu enlace de reseñas:
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={generatedLink}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(generatedLink)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={resetForm}
                      className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Generar otro enlace
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              ¿Por qué usar un enlace directo de reseñas?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Más fácil para tus clientes</h3>
                <p className="text-gray-600">
                  En lugar de pedirles que busquen tu negocio en Google, solo tienen que hacer clic en el enlace 
                  y pueden dejar su reseña inmediatamente.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Más reseñas</h3>
                <p className="text-gray-600">
                  Al eliminar la fricción del proceso, más clientes completarán el proceso de dejar una reseña, 
                  aumentando tu reputación online.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Úsalo en cualquier lugar</h3>
                <p className="text-gray-600">
                  Comparte el enlace por WhatsApp, email, redes sociales, o imprímelo en tarjetas. 
                  Funciona en cualquier dispositivo.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Completamente gratuito</h3>
                <p className="text-gray-600">
                  Esta herramienta es gratuita y no requiere registro. Simplemente introduce los datos 
                  de tu negocio y recibe tu enlace.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
        <CookiesBanner />
      </main>
    </>
  );
}
