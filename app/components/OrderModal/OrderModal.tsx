"use client";

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import pricesData from '@/app/data/prices.json';
import vouchersData from '@/app/data/vouchers.json';
import standsImage from '../Products/stand_02.png';
import localSeoIcon from '../Products/stand_local_seo.png';
import allInclusive from '../Products/stand_local_seo_360.png';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductId: string;
  onProductChange?: (productId: string) => void;
}

interface StandConfig {
  color: string;
}

interface PriceEntry {
  number_of_stands: number;
  local_seo: number;
  full_service: number;
  price: number;
  stands_units_discount: number;
  shipping: number;
  payment_link: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function OrderModal({ isOpen, onClose, selectedProductId, onProductChange }: OrderModalProps) {
  const [currentProductId, setCurrentProductId] = useState(selectedProductId);
  const [quantity, setQuantity] = useState(1);
  const [stands, setStands] = useState<StandConfig[]>([{ color: 'blanco' }]);
  const [formData, setFormData] = useState({
    voucher: '',
    email: '',
    phone: '',
    businessName: '',
    postcode: ''
  });
  
  // Voucher states
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  
  // Business search states
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Product configuration mapping
  const productConfig = {
    stand_only: { 
      local_seo: 0, 
      full_service: 0, 
      name: "Sólo Expositor NFC con código QR",
      image: standsImage,
      label: { text: "Más vendido", color: "#adadad" }
    },
    stand_visibility: { 
      local_seo: 1, 
      full_service: 0, 
      name: "Expositor + Pack Visibilidad en Google Maps",
      image: localSeoIcon,
      label: { text: "Mejor calidad precio", color: "#7f6d2a" }
    },
    stand_visibility_web: { 
      local_seo: 0, 
      full_service: 1, 
      name: "Gestión 360 Digital | Visibilidad Google Maps + Web",
      image: allInclusive,
      label: null
    }
  };

  const currentProductConfig = productConfig[currentProductId as keyof typeof productConfig];

  // Find price entry based on quantity and product type
  const findPriceEntry = (numberOfStands: number): PriceEntry | null => {
    if (!currentProductConfig) return null;
    
    return pricesData.find(entry => 
      entry.number_of_stands === numberOfStands &&
      entry.local_seo === currentProductConfig.local_seo &&
      entry.full_service === currentProductConfig.full_service
    ) || null;
  };

  const currentPriceEntry = findPriceEntry(quantity);

  // Update current product when prop changes
  useEffect(() => {
    setCurrentProductId(selectedProductId);
  }, [selectedProductId]);

  // Auto-set quantity to 3 for local_seo or full_service products
  useEffect(() => {
    if (currentProductConfig && (currentProductConfig.local_seo === 1 || currentProductConfig.full_service === 1)) {
      setQuantity(3);
    } else if (currentProductConfig && currentProductConfig.local_seo === 0 && currentProductConfig.full_service === 0) {
      setQuantity(1); // Reset to 1 for stand_only
    }
  }, [currentProductConfig]);

  useEffect(() => {
    // Reset stands when quantity changes
    if (quantity > stands.length) {
      const newStands = [...stands];
      while (newStands.length < quantity) {
        newStands.push({ color: 'blanco' });
      }
      setStands(newStands);
    } else if (quantity < stands.length) {
      setStands(stands.slice(0, quantity));
    }
  }, [quantity, stands.length]);

  useEffect(() => {
    if (!isOpen || !formData.businessName || !formData.postcode) return;

    setIsSearching(true);
    setSearchError(null);

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initMap = () => {
      if (mapRef.current) {
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.4168, lng: -3.7038 }, // Madrid center
          zoom: 2,
        });
        setMap(newMap);

        // Create Places service
        const placesService = new window.google.maps.places.PlacesService(newMap);

        // Search for the business
        const searchQuery = `${formData.businessName} ${formData.postcode}`;
        const request = {
          query: searchQuery,
          fields: ['name', 'geometry', 'place_id', 'formatted_address'],
        };

        placesService.textSearch(request, (results: any[], status: string) => {
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
            setSearchError('No se encontró el negocio con ese nombre y código postal');
          }
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.initMap;
    };
  }, [formData.businessName, formData.postcode, isOpen]);

  const handleProductChange = (productId: string) => {
    setCurrentProductId(productId);
    
    // Auto-set quantity based on product type
    const newProductConfig = productConfig[productId as keyof typeof productConfig];
    if (newProductConfig && (newProductConfig.local_seo === 1 || newProductConfig.full_service === 1)) {
      setQuantity(3);
    } else if (newProductConfig && newProductConfig.local_seo === 0 && newProductConfig.full_service === 0) {
      setQuantity(1);
    }
    
    if (onProductChange) {
      onProductChange(productId);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(3, quantity + delta)); // Limit to 3 based on pricing data
    setQuantity(newQuantity);
  };

  const handleStandColorChange = (index: number, color: string) => {
    const newStands = [...stands];
    newStands[index].color = color;
    setStands(newStands);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateVoucher = (voucherCode: string) => {
    const voucher = vouchersData.vouchers.find(v => 
      v.code.toUpperCase() === voucherCode.toUpperCase() && v.active
    );
    
    if (voucher) {
      setAppliedVoucher(voucher);
      setVoucherError(null);
      return true;
    } else {
      setAppliedVoucher(null);
      setVoucherError('Código de descuento no válido');
      return false;
    }
  };

  const handleVoucherSubmit = () => {
    if (formData.voucher.trim()) {
      validateVoucher(formData.voucher.trim());
    }
  };

  const handleVoucherInputChange = (value: string) => {
    handleInputChange('voucher', value);
    if (value.trim() === '') {
      setAppliedVoucher(null);
      setVoucherError(null);
    }
  };

  const calculateSubtotal = () => {
    return currentPriceEntry ? currentPriceEntry.price : 0;
  };

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    const subtotal = calculateSubtotal();
    return (subtotal * appliedVoucher.discount_percentage) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return subtotal - discount;
  };

  const getDiscountInfo = () => {
    if (!currentPriceEntry || currentPriceEntry.stands_units_discount === 0) return null;
    return `${currentPriceEntry.stands_units_discount}% descuento por cantidad`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Order submitted:', {
      productId: currentProductId,
      productConfig: currentProductConfig,
      quantity,
      stands,
      formData,
      selectedPlace,
      priceEntry: currentPriceEntry,
      appliedVoucher,
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      total: calculateTotal()
    });
    onClose();
  };

  if (!isOpen || !currentProductConfig) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Realizar Pedido</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Simplified Discount Ribbon */}
          <div className="bg-[#7f6d2a] text-white py-2 px-6">
            <div className="flex justify-center items-center gap-4 text-sm">
              <span className="font-bold">¡50% de descuento!</span>
              <span>
                Usa el código <span className="font-mono bg-white/20 px-2 py-1 rounded text-xs">
                  {(() => {
                    const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
                    return `${months[new Date().getMonth()]}50`;
                  })()}
                </span>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {Object.entries(productConfig).map(([productId, config]) => {
                // Find price for this specific product
                const productPriceEntry = pricesData.find(entry => 
                  entry.number_of_stands === 1 &&
                  entry.local_seo === config.local_seo &&
                  entry.full_service === config.full_service
                );
                
                return (
                  <div
                    key={productId}
                    className={`relative bg-white rounded-xl p-4 cursor-pointer transition-all overflow-visible ${
                      currentProductId === productId
                        ? 'border-4 border-[#7f6d2a] shadow-lg'
                        : 'border-2 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleProductChange(productId)}
                  >
                    {config.label && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <span 
                          className="text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm"
                          style={{ backgroundColor: config.label.color }}
                        >
                          {config.label.text}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-center mb-3">
                      <Image
                        src={config.image}
                        alt={config.name}
                        width={120}
                        height={120}
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    
                    <h4 className="font-medium text-sm text-center text-gray-900 mb-2">
                      {config.name}
                    </h4>
                    
                    {productPriceEntry && (
                      <div className="text-center">
                        {currentProductId === productId && appliedVoucher ? (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500 line-through">
                              {currentPriceEntry?.price.toFixed(2)}€
                            </p>
                            <p className="text-[#7f6d2a] font-bold">
                              {currentPriceEntry ? (currentPriceEntry.price - (currentPriceEntry.price * appliedVoucher.discount_percentage / 100)).toFixed(2) : productPriceEntry.price.toFixed(2)}€
                            </p>
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              -{appliedVoucher.discount_percentage}%
                            </span>
                          </div>
                        ) : (
                          <p className="text-[#7f6d2a] font-bold">
                            {currentProductId === productId && currentPriceEntry ? 
                              `${currentPriceEntry.price.toFixed(2)}€` : 
                              `Desde ${productPriceEntry.price.toFixed(2)}€`
                            }
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voucher Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-2">
              <button
                type="button"
                onClick={() => setShowVoucherInput(!showVoucherInput)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ¿Tienes un descuento?
              </button>
            </div>
            
            {/* Voucher Input Area */}
            {showVoucherInput && (
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-2">
                <div className="flex gap-2 max-w-[350px]">
                  <input
                    type="text"
                    value={formData.voucher}
                    onChange={(e) => handleVoucherInputChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent text-sm"
                    placeholder="Introduce tu código de descuento"
                  />
                  <button
                    type="button"
                    onClick={handleVoucherSubmit}
                    className="px-4 py-2 bg-[#7f6d2a] text-white rounded-lg hover:bg-[#6a5a23] transition-colors text-sm"
                  >
                    Aplicar
                  </button>
                </div>
                
                {voucherError && (
                  <p className="text-red-500 text-sm mt-2">{voucherError}</p>
                )}
                
                {appliedVoucher && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                    <p className="text-green-800 text-sm font-medium">
                      ✓ {appliedVoucher.description}
                    </p>
                    <p className="text-green-600 text-sm">
                      Descuento: -{appliedVoucher.discount_percentage}% (-{calculateDiscount().toFixed(2)}€)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity and Color Selection */}
          <div className="space-y-4">
            <div>
              {currentProductConfig?.local_seo === 1 || currentProductConfig?.full_service === 1 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de Expositores (Incluye 3 expositores)
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      disabled={true}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-300 flex items-center justify-center opacity-50 cursor-not-allowed"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-semibold">{quantity}</span>
                    <button
                      type="button"
                      disabled={true}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-300 flex items-center justify-center opacity-50 cursor-not-allowed"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-blue-600 font-medium ml-4">Pack fijo de 3 expositores</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de Expositores (1-3)
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full border-2 border-[#7f6d2a] text-[#7f6d2a] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7f6d2a] hover:text-white transition-colors"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 3}
                      className="w-10 h-10 rounded-full border-2 border-[#7f6d2a] text-[#7f6d2a] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#7f6d2a] hover:text-white transition-colors"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                    {getDiscountInfo() && (
                      <span className="text-sm text-green-600 font-medium ml-4">{getDiscountInfo()}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Color selection for each stand */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Color de los Expositores</label>
              {stands.map((stand, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Expositor {index + 1}:</span>
                  <div className="flex space-x-2">
                    {['blanco', 'negro'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleStandColorChange(index, color)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          stand.color === color
                            ? 'bg-[#7f6d2a] text-white border-[#7f6d2a]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#7f6d2a]'
                        }`}
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent"
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal del Negocio *
              </label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent"
                placeholder="28001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Negocio *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent"
              placeholder="Nombre de tu negocio"
            />
          </div>

          {/* Business Search Map */}
          {formData.businessName && formData.postcode && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">¿Es este tu negocio?</h4>
              <div ref={mapRef} className="w-full h-64 rounded-lg border" />
              
              {isSearching && (
                <p className="text-center text-gray-600">Buscando tu negocio...</p>
              )}
              
              {searchError && (
                <p className="text-center text-red-600">{searchError}</p>
              )}
              
              {selectedPlace && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800">{selectedPlace.name}</h5>
                  <p className="text-sm text-green-600">{selectedPlace.formatted_address}</p>
                </div>
              )}
            </div>
          )}

          {/* Total and Submit */}
          <div className="border-t pt-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Subtotal:</span>
                <span className="text-lg text-gray-700">
                  {calculateSubtotal().toFixed(2)}€
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-lg">Envío a 🇪🇸 (1 a 3 días):</span>
                <span className="text-lg text-gray-700">
                  {currentPriceEntry?.shipping ? `${currentPriceEntry.shipping.toFixed(2)}€` : 'Gratis'}
                </span>
              </div>
              
              {appliedVoucher && (
                <div className="flex justify-between items-center">
                  <span className="text-lg text-green-600">
                    Descuento ({appliedVoucher.discount_percentage}%):
                  </span>
                  <span className="text-lg text-green-600">
                    -{calculateDiscount().toFixed(2)}€
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[#7f6d2a]">
                  {calculateTotal().toFixed(2)}€
                </span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!currentPriceEntry}
              className="w-full bg-[#7f6d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 