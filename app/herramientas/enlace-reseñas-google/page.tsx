
"use client";

import { useState, useEffect, useRef } from 'react';
import { MapPinIcon, LinkIcon, EnvelopeIcon, MagnifyingGlassIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
}

export default function GoogleReviewLinkGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<'none' | 'confirmed' | 'rejected'>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  const searchBusiness = () => {
    if (!businessName || !postcode) return;

    setIsSearching(true);
    setSearchError(null);
    setUserFeedback('none');
    setSelectedPlace(null);

    const searchTimeout = setTimeout(() => {
      setIsSearching(false);
      setSearchError('Búsqueda expirada. Inténtalo de nuevo.');
    }, 10000);

    const performSearch = () => {
      try {
        if (mapRef.current) {
          const newMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.4168, lng: -3.7038 }, // Madrid center
            zoom: 2,
          });
          setMap(newMap);

          const placesService = new window.google.maps.places.PlacesService(newMap);
          const searchQuery = `${businessName} ${postcode} España`;
          
          const request = {
            query: searchQuery,
            fields: ['name', 'geometry', 'place_id', 'formatted_address', 'rating', 'user_ratings_total'],
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
              setSearchError('No se encontró el negocio. Verifica el nombre y código postal.');
            }
          });
        }
      } catch (error) {
        clearTimeout(searchTimeout);
        setIsSearching(false);
        setSearchError('Error al buscar el negocio. Por favor, inténtalo de nuevo.');
      }
    };

    if (window.google && window.google.maps) {
      performSearch();
    } else {
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

  const generateReviewLink = async () => {
    if (!selectedPlace || !email) return;

    setIsGenerating(true);

    try {
      // Generate the Google review link
      const reviewUrl = `https://search.google.com/local/writereview?placeid=${selectedPlace.place_id}`;
      
      // Create experience using the tools API
      const response = await fetch('https://tools.just5stars.com/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Enlace reseñas - ${selectedPlace.name}`,
          type: 'redirect',
          primary_url: reviewUrl,
          customer_email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el enlace');
      }

      const data = await response.json();
      const shortLink = data.experiences?.[0]?.short_url;

      if (shortLink) {
        setGeneratedLink(shortLink);
        
        // Send email with the link
        const emailResponse = await fetch('/api/send-review-link-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            businessName: selectedPlace.name,
            reviewLink: shortLink,
            originalLink: reviewUrl,
          }),
        });

        if (emailResponse.ok) {
          setIsEmailSent(true);
        }
      }
    } catch (error) {
      console.error('Error generating review link:', error);
      setSearchError('Error al generar el enlace. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <main>
        <Navbar />
        <div className="pt-20 pb-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                <LinkIcon className="w-4 h-4 mr-2" />
                Herramienta Gratuita
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Generador de Enlaces de
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Reseñas de Google
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Crea un enlace directo para que tus clientes puedan dejar reseñas en Google de forma rápida y sencilla. 
                Solo necesitas el nombre de tu negocio y código postal.
              </p>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="space-y-6">
                {/* Business Search Form */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="w-4 h-4 inline mr-1" />
                      Nombre del Negocio *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Restaurante El Ejemplo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="w-4 h-4 inline mr-1" />
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="28001"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                    Email (recibirás el enlace por correo) *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={searchBusiness}
                  disabled={!businessName || !postcode || isSearching}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Buscando negocio...
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
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-700">{searchError}</p>
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
                        <p className="text-sm text-blue-700 mb-2">{selectedPlace.formatted_address}</p>
                        {selectedPlace.rating && (
                          <p className="text-sm text-blue-600 mb-4">
                            ⭐ {selectedPlace.rating} ({selectedPlace.user_ratings_total} reseñas)
                          </p>
                        )}
                        
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
                        <div className="flex items-center mb-4">
                          <CheckIcon className="w-6 h-6 text-green-600 mr-3" />
                          <h5 className="font-semibold text-green-800">¡Negocio Confirmado!</h5>
                        </div>
                        <p className="text-sm text-green-700 mb-4">
                          Perfecto, ahora podemos generar tu enlace de reseñas personalizado.
                        </p>
                        
                        <button
                          onClick={generateReviewLink}
                          disabled={!email || isGenerating}
                          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                    
                    {userFeedback === 'rejected' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-700">
                          Prueba con un nombre más específico o verifica el código postal. 
                          También puedes contactarnos y te ayudaremos a encontrar tu negocio.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Generated Link Result */}
                {generatedLink && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CheckIcon className="w-6 h-6 text-green-600 mr-3" />
                      <h5 className="font-semibold text-green-800">¡Enlace Generado con Éxito!</h5>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mb-4">
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
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                    
                    {isEmailSent && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          ✉️ También hemos enviado el enlace a tu email: {email}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-sm text-green-700 space-y-2">
                      <p><strong>¿Cómo usarlo?</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Comparte este enlace con tus clientes</li>
                        <li>Al hacer clic, serán dirigidos directamente a dejar una reseña</li>
                        <li>Puedes usarlo en WhatsApp, email, tarjetas, etc.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* How it works section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">¿Cómo Funciona?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Encuentra tu Negocio</h4>
                  <p className="text-gray-600 text-sm">
                    Ingresa el nombre de tu negocio y código postal. Nuestro sistema buscará tu ficha en Google.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LinkIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. Genera el Enlace</h4>
                  <p className="text-gray-600 text-sm">
                    Confirmamos que es tu negocio y generamos un enlace directo a tu página de reseñas de Google.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. Recibe por Email</h4>
                  <p className="text-gray-600 text-sm">
                    Te enviamos el enlace por email para que puedas compartirlo fácilmente con tus clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
        <CookiesBanner />
      </main>
    </>
  );
}
