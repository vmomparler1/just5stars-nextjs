
"use client";

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, LinkIcon, EnvelopeIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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

export default function GoogleReviewLinkGeneratorPage() {
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
  
  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBusiness = () => {
    if (!formData.businessName || !formData.postcode) return;

    setIsSearching(true);
    setSearchError(null);
    setUserFeedback('none');
    setSelectedPlace(null);

    // Add timeout to prevent getting stuck
    const searchTimeout = setTimeout(() => {
      setIsSearching(false);
      setSearchError('La búsqueda ha tardado demasiado. Por favor, inténtalo de nuevo.');
    }, 10000);

    const performSearch = () => {
      try {
        if (mapRef.current) {
          const newMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.4168, lng: -3.7038 }, // Madrid center
            zoom: 2,
          });
          setMap(newMap);

          // Create Places service
          const placesService = new window.google.maps.places.PlacesService(newMap);

          // Search for the business
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

              // Center map on the place
              newMap.setCenter(place.geometry.location);
              newMap.setZoom(15);

              // Add marker
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
              setSearchError('No se pudo encontrar el negocio con el nombre y código postal proporcionados.');
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

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      performSearch();
    } else {
      // Load Google Maps script
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        window.initMap = performSearch;
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
        window.initMap = performSearch;
      }
    }
  };

  const handleBusinessConfirmation = (confirmed: boolean) => {
    setUserFeedback(confirmed ? 'confirmed' : 'rejected');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset states when business info changes
    if (field === 'businessName' || field === 'postcode') {
      setUserFeedback('none');
      setSelectedPlace(null);
      setSearchError(null);
      setGeneratedLink(null);
      setIsEmailSent(false);
      setError(null);
    }
  };

  const generateReviewLink = async () => {
    if (!selectedPlace || !formData.email) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Generate the Google review link
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

      const data = await response.json();
      
      if (data.experiences && data.experiences.length > 0) {
        const shortLink = `https://tools.just5stars.com/r/${data.experiences[0].short_id}`;
        setGeneratedLink(shortLink);

        // Send email with the link
        await sendReviewLinkEmail(shortLink);
        setIsEmailSent(true);
      } else {
        throw new Error('No se pudo generar el enlace');
      }

    } catch (error) {
      console.error('Error generating review link:', error);
      setError('Error al generar el enlace de reseñas. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReviewLinkEmail = async (reviewLink: string) => {
    try {
      const response = await fetch('/api/send-review-link-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          businessName: selectedPlace.name,
          reviewLink: reviewLink,
          businessAddress: selectedPlace.formatted_address
        })
      });

      if (!response.ok) {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
    }
  };

  return (
    <>
      <main>
        <Navbar />
        
        <section className="pt-20 pb-32 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Generador de Enlaces de Reseñas de Google
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Crea un enlace directo para que tus clientes puedan dejar reseñas en Google fácilmente. 
                Solo busca tu negocio y te enviaremos el enlace por email.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Step 1: Business Search */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <MagnifyingGlassIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Paso 1: Busca tu negocio
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Negocio *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      onBlur={searchBusiness}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Restaurante El Buen Sabor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => handleInputChange('postcode', e.target.value)}
                      onBlur={searchBusiness}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="28001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <input
                    type="text"
                    value={formData.businessCountry}
                    onChange={(e) => handleInputChange('businessCountry', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="España"
                  />
                </div>

                {/* Loading State */}
                {isSearching && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-blue-600">Buscando tu negocio...</span>
                    </div>
                  </div>
                )}

                {/* Search Error */}
                {searchError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800">{searchError}</p>
                    </div>
                  </div>
                )}

                {/* Business Search Map */}
                {(isSearching || selectedPlace) && (
                  <div className="space-y-4">
                    {selectedPlace && <h4 className="font-medium text-gray-700">¿Es este tu negocio?</h4>}
                    <div ref={mapRef} className="w-full h-64 rounded-lg border" />
                    
                    {selectedPlace && userFeedback === 'none' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-800 mb-2">{selectedPlace.name}</h5>
                        <p className="text-sm text-blue-700 mb-4">{selectedPlace.formatted_address}</p>
                        
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => handleBusinessConfirmation(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Sí, es mi negocio
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBusinessConfirmation(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            No, no es mi negocio
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {userFeedback === 'confirmed' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
                          <h5 className="font-semibold text-green-800">¡Perfecto!</h5>
                        </div>
                        <p className="text-sm text-green-700 mb-2">Negocio confirmado:</p>
                        <p className="font-medium text-green-800">{selectedPlace.name}</p>
                        <p className="text-sm text-green-700">{selectedPlace.formatted_address}</p>
                      </div>
                    )}
                    
                    {userFeedback === 'rejected' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                          <h5 className="font-semibold text-yellow-800">Busca de nuevo</h5>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Intenta con un nombre más específico o verifica el código postal.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Email Input */}
                {userFeedback === 'confirmed' && (
                  <div className="border-t pt-6 space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <EnvelopeIcon className="w-6 h-6 mr-2 text-blue-600" />
                      Paso 2: Introduce tu email
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Te enviaremos el enlace de reseñas a este email.
                      </p>
                    </div>

                    <button
                      onClick={generateReviewLink}
                      disabled={!formData.email || isGenerating}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                          <LinkIcon className="w-5 h-5 mr-2" />
                          Generar Enlace de Reseñas
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {generatedLink && isEmailSent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CheckIcon className="w-6 h-6 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800">¡Enlace generado con éxito!</h3>
                    </div>
                    
                    <p className="text-green-700 mb-4">
                      Hemos enviado el enlace de reseñas a <strong>{formData.email}</strong>
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 border">
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
                          onClick={copyToClipboard}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-green-700">
                      <p className="font-medium mb-2">¿Cómo usar el enlace?</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Comparte este enlace con tus clientes</li>
                        <li>Cuando hagan clic, irán directamente a dejar una reseña en Google</li>
                        <li>También puedes crear un código QR con este enlace</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">¿Por qué usar nuestro generador?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span className="text-gray-700">Enlace directo sin pasos intermedios</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span className="text-gray-700">Funciona en todos los dispositivos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span className="text-gray-700">Fácil de compartir y usar</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span className="text-gray-700">Completamente gratuito</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">¿Necesitas más herramientas?</h3>
                <p className="text-gray-700 mb-4">
                  Si quieres una solución más completa para conseguir reseñas, echa un vistazo a nuestros expositores NFC.
                </p>
                <a
                  href="/stand-google"
                  className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Ver Expositores NFC
                </a>
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
