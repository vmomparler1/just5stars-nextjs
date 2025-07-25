"use client";

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import pricesData from '@/app/data/prices.json';
import vouchersData from '@/app/data/vouchers.json';
import productsData from '@/app/data/products.json';
import standsImage from '../Products/stand_02.png';
import localSeoIcon from '../Products/stand_local_seo.png';
import allInclusive from '../Products/stand_local_seo_360.png';
import standWhite from '../Products/stand_white.png';
import standBlack from '../Products/stand_black.png';
import { appendUTMToUrl, getStoredUTMParameters } from '@/app/utils/utmTracking';

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
  stands_units_discount?: number;
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
    postcode: '',
    businessCountry: 'España',
    acceptPrivacyPolicy: false,
    acceptTermsAndConditions: false
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
  const [userFeedback, setUserFeedback] = useState<'none' | 'confirmed' | 'rejected'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [monthCode, setMonthCode] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Generate month code on client side only
  useEffect(() => {
    const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    setMonthCode(`${months[new Date().getMonth()]}50`);
    setIsClient(true);
  }, []);



  // Product configuration mapping from centralized data
  const productConfig = {
    stand_only: { 
      local_seo: productsData.stand_only.local_seo, 
      full_service: productsData.stand_only.full_service, 
      name: productsData.stand_only.title,
      image: standsImage,
      label: productsData.stand_only.label,
      secondary_label: productsData.stand_only.secondary_label
    },
    stand_visibility: { 
      local_seo: productsData.stand_visibility.local_seo, 
      full_service: productsData.stand_visibility.full_service, 
      name: productsData.stand_visibility.title,
      image: localSeoIcon,
      label: productsData.stand_visibility.label,
      secondary_label: productsData.stand_visibility.secondary_label
    },
    stand_visibility_web: { 
      local_seo: productsData.stand_visibility_web.local_seo, 
      full_service: productsData.stand_visibility_web.full_service, 
      name: productsData.stand_visibility_web.title,
      image: allInclusive,
      label: productsData.stand_visibility_web.label,
      secondary_label: productsData.stand_visibility_web.secondary_label
    }
  };

  const currentProductConfig = productConfig[currentProductId as keyof typeof productConfig];

  // Find price entry based on quantity and product type
  const findPriceEntry = (numberOfStands: number): PriceEntry | null => {
    if (!currentProductConfig) return null;
    
    // For local_seo and full_service, always use 3 stands
    const standsToFind = (currentProductConfig.local_seo === 1 || currentProductConfig.full_service === 1) ? 3 : numberOfStands;
    
    return pricesData.find(entry => 
      entry.number_of_stands === standsToFind &&
      entry.local_seo === currentProductConfig.local_seo &&
      entry.full_service === currentProductConfig.full_service
    ) || null;
  };

  const currentPriceEntry = findPriceEntry(quantity);

  // Update current product when prop changes
  useEffect(() => {
    setCurrentProductId(selectedProductId);
  }, [selectedProductId]);

  // Auto-apply voucher when modal opens (client-side only)
  useEffect(() => {
    if (isOpen && isClient && monthCode) {
      // Auto-apply current month's voucher when modal opens (client-side only)
      handleInputChange('voucher', monthCode);
      validateVoucher(monthCode);
      setShowVoucherInput(true); // Show voucher section since we auto-applied one
    }
  }, [isOpen, isClient, monthCode]); // Only depend on modal open state, client state, and month code

  // Track modal open event separately
  useEffect(() => {
    if (isOpen && currentProductConfig) {
      // Ensure dataLayer exists and push event
      const pushToDataLayer = () => {
        if (typeof window !== 'undefined') {
          // Initialize dataLayer if it doesn't exist
          (window as any).dataLayer = (window as any).dataLayer || [];
          
          (window as any).dataLayer.push({
            event: 'openModalProceedPayment',
            product_name: currentProductConfig.name,
            product_id: currentProductId,
            value: currentPriceEntry?.price || 0,
            currency: 'EUR'
          });
          console.log('✅ GTM - openModalProceedPayment event pushed to dataLayer');
        }
      };

      // Push immediately
      pushToDataLayer();
    }
  }, [isOpen, selectedProductId]); // Track when modal opens or product changes

  // Auto-set quantity to 3 for local_seo or full_service products only
  useEffect(() => {
    if (currentProductConfig && (currentProductConfig.local_seo === 1 || currentProductConfig.full_service === 1)) {
      setQuantity(3);
    }
    // Don't automatically reset stand_only products to 1 - let user control quantity
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

  const searchBusiness = () => {
    if (!isOpen || !formData.businessName || !formData.postcode) return;

    setIsSearching(true);
    setSearchError(null);
    setUserFeedback('none');

    // Add timeout to prevent getting stuck
    const searchTimeout = setTimeout(() => {
      setIsSearching(false);
      console.log('Search timeout: Business search timed out after 10 seconds');
    }, 10000); // 10 second timeout

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
              console.log('Business not found: No business found with the provided name and postcode');
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
      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Script is already loading, wait for it
        window.initMap = () => {
          try {
            performSearch();
          } catch (error) {
            clearTimeout(searchTimeout);
            setIsSearching(false);
            setSearchError('Error al cargar Google Maps. Por favor, inténtalo de nuevo.');
            console.error('Maps loading error:', error);
          }
        };
      } else {
        // Load Google Maps script for the first time
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
            console.error('Maps loading error:', error);
          }
        };
      }
    }
  };

  // Reset form and cleanup on modal close
  useEffect(() => {
    if (!isOpen) {
      // Reset form data when modal closes
      setFormData({
        voucher: '',
        email: '',
        phone: '',
        businessName: '',
        postcode: '',
        businessCountry: 'España',
        acceptPrivacyPolicy: false,
        acceptTermsAndConditions: false
      });
      setAppliedVoucher(null);
      setVoucherError(null);
      setShowVoucherInput(false);
      setSelectedPlace(null);
      setUserFeedback('none');
      setSearchError(null);
    }
    
    return () => {
      if ('initMap' in window) {
        delete (window as any).initMap;
      }
    };
  }, [isOpen]);

  const handleBusinessConfirmation = (confirmed: boolean) => {
    setUserFeedback(confirmed ? 'confirmed' : 'rejected');
  };

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset user feedback when business name or postcode changes
    if (field === 'businessName' || field === 'postcode') {
      setUserFeedback('none');
      setSelectedPlace(null);
      setSearchError(null);
    }
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
    // Only show stands unit discount for stand_only product (product 1)
    if (!currentPriceEntry || !currentPriceEntry.stands_units_discount || currentPriceEntry.stands_units_discount === 0) return null;
    if (!currentProductConfig || currentProductConfig.local_seo === 1 || currentProductConfig.full_service === 1) return null;
    return `${currentPriceEntry.stands_units_discount}% descuento por cantidad`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPriceEntry || !currentProductConfig) {
      alert('Error: No product selected');
      return;
    }

    if (!currentPriceEntry.payment_link) {
      alert('Error: No payment link available for this product combination');
      return;
    }

    setIsSubmitting(true);
    console.log('🚀 Starting order submission process...');

    try {
      // Push proceedToStripe event to dataLayer
      if (typeof window !== 'undefined') {
        // Initialize dataLayer if it doesn't exist
        (window as any).dataLayer = (window as any).dataLayer || [];
        
        (window as any).dataLayer.push({
          event: 'proceedToStripe',
          product_name: currentProductConfig.name,
          product_id: currentProductId,
          quantity: quantity,
          value: calculateTotal(),
          currency: 'EUR',
          customer_email: formData.email,
          customer_phone: formData.phone
        });
        console.log('✅ GTM - proceedToStripe event pushed to dataLayer');
      }

      // Get UTM parameters for database storage
      const utmParams = getStoredUTMParameters() || {};

      // Prepare order data for database storage
      const orderDataForDB = {
        product_name: currentProductConfig.name,
        product_id: currentProductId,
        quantity: quantity,
        price: currentPriceEntry.price,
        discount_amount: appliedVoucher ? (currentPriceEntry.price * appliedVoucher.discount_percentage / 100) : 0,
        voucher_code: appliedVoucher?.code || null,
        customer_email: formData.email,
        customer_phone: formData.phone,
        business_name: formData.businessName,
        business_postcode: formData.postcode,
        business_country: formData.businessCountry,
        google_business_id: selectedPlace?.place_id || null,
        stand_colors: stands,
        utm_params: utmParams
      };

      // Store order in database
      console.log('💾 Storing order in database...');
      const storeResponse = await fetch('/api/store-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDataForDB),
      });

      if (!storeResponse.ok) {
        throw new Error('Failed to store order in database');
      }

      const { order_id } = await storeResponse.json();
      console.log('✅ Order stored successfully with ID:', order_id);

      // Prepare order data for email
      const orderDataForEmail = {
        productName: currentProductConfig.name,
        voucherApplied: appliedVoucher ? `${appliedVoucher.code} (${appliedVoucher.discount_percentage}% off)` : null,
        price: calculateTotal().toFixed(2),
        numberOfStands: quantity,
        colorStands: stands,
        businessName: formData.businessName,
        businessPostcode: formData.postcode,
        businessCountry: formData.businessCountry,
        email: formData.email,
        phoneNumber: formData.phone,
        googleBusinessId: selectedPlace?.place_id || null
      };

      // Skip email sending during preorder - emails will be sent after payment confirmation
      console.log('⏭️ Skipping email during preorder - will send confirmation after payment');
      }

      // Determine payment link based on environment
      console.log('🔗 Building payment URL...');
      const isProduction = process.env.NEXT_PUBLIC_APP_ENVIRONMENT === 'production';
      const testPaymentLink = 'https://buy.stripe.com/test_5kQ5kFbrR1YU53N2gz3ks00';
      let paymentUrl = isProduction ? currentPriceEntry.payment_link : testPaymentLink;
      
      console.log('Environment check:', { 
        isProduction, 
        environment: process.env.NEXT_PUBLIC_APP_ENVIRONMENT,
        usingLink: paymentUrl 
      });
      
      const urlParams = new URLSearchParams();
      
      // Add client_reference_id (order ID for tracking)
      urlParams.set('client_reference_id', order_id);
      
      // Add prefilled_email
      urlParams.set('prefilled_email', formData.email);
      
      // Add voucher code if applied
      if (appliedVoucher) {
        urlParams.set('prefilled_promo_code', appliedVoucher.code);
      }
      
      // Add UTM parameters if available
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value);
        }
      });
      
      // Add success URL to redirect to thank you page
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://just5stars.com';
      urlParams.set('success_url', `${baseUrl}/thank-you?chsid={CHECKOUT_SESSION_ID}`);
      
      // Construct final payment URL
      const separator = paymentUrl.includes('?') ? '&' : '?';
      paymentUrl += `${separator}${urlParams.toString()}`;

      console.log('Final payment URL:', paymentUrl);

      // Redirect immediately to payment
      console.log('🚀 Redirecting to Stripe...');
      window.location.href = paymentUrl;

    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
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
                  {monthCode || '---50'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(monthCode);
                  handleInputChange('voucher', monthCode);
                  setShowVoucherInput(true);
                }}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {Object.entries(productConfig).map(([productId, config]) => {
                // Find price for this specific product - use correct number of stands
                const standsToLookFor = (config.local_seo === 1 || config.full_service === 1) ? 3 : 1;
                const productPriceEntry = pricesData.find(entry => 
                  entry.number_of_stands === standsToLookFor &&
                  entry.local_seo === config.local_seo &&
                  entry.full_service === config.full_service
                );
                
                return (
                  <div
                    key={productId}
                    className={`relative bg-white rounded-xl cursor-pointer transition-all overflow-visible ${
                      currentProductId === productId
                        ? 'border-4 border-[#7f6d2a] shadow-lg p-3'
                        : 'border-2 border-gray-200 hover:border-gray-300 p-4'
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
                              {currentPriceEntry?.price.toFixed(2)}€{(config.local_seo === 1 || config.full_service === 1) ? '/mes' : ''}
                            </p>
                            <p className="text-[#7f6d2a] font-bold">
                              {currentPriceEntry ? (currentPriceEntry.price - (currentPriceEntry.price * appliedVoucher.discount_percentage / 100)).toFixed(2) : productPriceEntry.price.toFixed(2)}€{(config.local_seo === 1 || config.full_service === 1) ? '/mes' : ''}
                            </p>
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              -{appliedVoucher.discount_percentage}%
                            </span>
                          </div>
                        ) : (
                          <p className="text-[#7f6d2a] font-bold">
                            {currentProductId === productId && currentPriceEntry ? 
                              `${currentPriceEntry.price.toFixed(2)}€${(config.local_seo === 1 || config.full_service === 1) ? '/mes' : ''}` : 
                              `${productPriceEntry.price.toFixed(2)}€${(config.local_seo === 1 || config.full_service === 1) ? '/mes' : ''}`
                            }
                          </p>
                        )}
                        {config.secondary_label && (
                          <div className="mt-2">
                            <span 
                              className="text-[#7f6d2a] text-xs font-semibold px-2 py-1 rounded-full border border-[#7f6d2a]"
                            >
                              {config.secondary_label.text}
                            </span>
                          </div>
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
                className="text-sm text-[#7f6d2a] hover:text-[#6a5a23] underline"
              >
                {appliedVoucher ? "✓ Descuento aplicado - Modificar código" : "¿Tienes un descuento?"}
              </button>
            </div>
            
            {/* Voucher Input Area */}
            {showVoucherInput && (
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-2 max-w-[400px]">
                <div className="flex gap-2">
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
                    <span className="text-sm text-[#7f6d2a] font-medium ml-4">Pack fijo de 3 expositores</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stands.map((stand, index) => (
                  <div key={index} className="flex flex-col items-center space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-center">
                      <Image
                        src={stand.color === 'blanco' ? standWhite : standBlack}
                        alt={`Expositor ${index + 1} ${stand.color}`}
                        width={60}
                        height={60}
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    <div className="flex space-x-2">
                      {['blanco', 'negro'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleStandColorChange(index, color)}
                          className={`px-3 py-1 rounded-lg border transition-colors text-sm ${
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                onBlur={searchBusiness}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent"
                placeholder="Nombre de tu negocio"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País del Negocio *
            </label>
            <input
              type="text"
              value={formData.businessCountry}
              onChange={(e) => handleInputChange('businessCountry', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent"
              placeholder="España"
            />
          </div>

          {/* Privacy Policy and Terms Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacy-policy"
                  type="checkbox"
                  checked={formData.acceptPrivacyPolicy}
                  onChange={(e) => handleInputChange('acceptPrivacyPolicy', e.target.checked)}
                  required
                  className="w-4 h-4 text-[#7f6d2a] bg-gray-100 border-gray-300 rounded focus:ring-[#7f6d2a] focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="privacy-policy" className="text-gray-700">
                  He leído y acepto la{' '}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7f6d2a] hover:underline font-medium"
                  >
                    Política de Privacidad
                  </a>
                  {' '}*
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms-conditions"
                  type="checkbox"
                  checked={formData.acceptTermsAndConditions}
                  onChange={(e) => handleInputChange('acceptTermsAndConditions', e.target.checked)}
                  required
                  className="w-4 h-4 text-[#7f6d2a] bg-gray-100 border-gray-300 rounded focus:ring-[#7f6d2a] focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms-conditions" className="text-gray-700">
                  He leído y acepto los{' '}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7f6d2a] hover:underline font-medium"
                  >
                    Términos y Condiciones
                  </a>
                  {' '}*
                </label>
              </div>
            </div>
          </div>

          {/* Business Search Status */}
          {formData.businessName && formData.postcode && isSearching && (
            <div className="text-center py-2">
              <p className="text-gray-600">Buscando tu negocio...</p>
            </div>
          )}
          


          {/* Business Search Map */}
          {(isSearching || selectedPlace) && (
            <div className="space-y-4">
              {selectedPlace && <h4 className="font-medium text-gray-700">¿Es este tu negocio?</h4>}
              <div ref={mapRef} className="w-full h-64 rounded-lg border" />
              
              {selectedPlace && userFeedback === 'none' && (
                <div className="bg-[#7f6d2a]/10 border border-[#7f6d2a]/30 rounded-lg p-4">
                  <h5 className="font-semibold text-[#7f6d2a] mb-2">{selectedPlace.name}</h5>
                  <p className="text-sm text-[#7f6d2a]/80 mb-4">{selectedPlace.formatted_address}</p>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => handleBusinessConfirmation(true)}
                        className="px-4 py-2 bg-[#7f6d2a] text-white rounded-lg hover:bg-[#6a5a23] transition-colors text-sm font-medium max-h-[36px]"
                      >
                        Sí, es mi negocio
                      </button>
                      <div>
                        <button
                        type="button"
                        onClick={() => handleBusinessConfirmation(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                        No, no es mi negocio
                        </button>
                        <div className="text-xs text-[#7f6d2a]/70 italic">
                            (No pasa nada. Nosotros nos encargaremos de encontrarlo por ti.)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedPlace && userFeedback === 'confirmed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 relative">
                  <button
                    type="button"
                    onClick={() => setUserFeedback('none')}
                    className="absolute top-2 right-2 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h5 className="font-semibold text-green-800">¡Perfecto!</h5>
                  </div>
                  <p className="text-sm text-green-600 mb-2">Hemos confirmado tu negocio:</p>
                  <p className="font-medium text-green-800">{selectedPlace.name}</p>
                  <p className="text-sm text-green-600">{selectedPlace.formatted_address}</p>
                </div>
              )}
              
              {userFeedback === 'rejected' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h5 className="font-semibold text-yellow-800">No te preocupes</h5>
                  </div>
                  <p className="text-sm text-yellow-700">
                    No te preocupes, nosotros encontraremos tu negocio por ti. 
                    Continúa con tu pedido y nos pondremos en contacto contigo para confirmar la ubicación exacta.
                  </p>
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
            
            <div className="space-y-3">
              <button
                type="submit"
                disabled={!currentPriceEntry || isSubmitting}
                className="w-full bg-[#7f6d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Proceder al Pago'
                )}
              </button>
              
              {/* Development Mode Disclaimer */}
              {process.env.NEXT_PUBLIC_APP_ENVIRONMENT !== 'production' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Modo de Desarrollo:</strong> Usando enlace de pago de prueba de Stripe. No se procesarán pagos reales.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 