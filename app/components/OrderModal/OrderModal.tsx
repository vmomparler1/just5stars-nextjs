"use client";

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import vouchersData from '@/app/data/vouchers.json';
import productsData from '@/app/data/products.json';
import { getPricesData } from '@/app/utils/priceTracking';
import standsImage from '../Products/stand_02.png';
import localSeoIcon from '../Products/stand_local_seo.png';
import allInclusive from '../Products/stand_local_seo_360.png';
import standWhite from '../Products/stand_white.png';
import standBlack from '../Products/stand_black.png';
import { getStoredUTMParameters } from '@/app/utils/utmTracking';
import { getOrCreateTransactionId, clearTransactionId } from '@/app/utils/transactionId';
import { hashEmail, hashPhone } from '@/app/utils/hashUtils';
import { generateEventId } from '@/app/utils/eventId';

// Import stock data
import stockData from '@/app/data/stock.json';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductId: string;
  onProductChange?: (productId: string) => void;
  onlyStand?: boolean;
}

interface StandConfig {
  color: string;
}

interface BusinessData {
  businessName: string;
  postcode: string;
  businessCountry: string;
  copyFromFirst: boolean;
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

export default function OrderModal({ isOpen, onClose, selectedProductId, onProductChange, onlyStand = false }: OrderModalProps) {
  const [currentProductId, setCurrentProductId] = useState(selectedProductId);
  const [quantity, setQuantity] = useState(1);
  const [stands, setStands] = useState<StandConfig[]>([{ color: 'blanco' }]);
  const [formData, setFormData] = useState({
    voucher: '',
    email: '',
    phone: '',
    acceptPrivacyPolicy: false,
    acceptTermsAndConditions: false
  });

  const [businessData, setBusinessData] = useState<BusinessData[]>([{
    businessName: '',
    postcode: '',
    businessCountry: 'España',
    copyFromFirst: false
  }]);

  // Voucher states
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // Business search states - now arrays to handle multiple businesses
  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maps, setMaps] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userFeedbacks, setUserFeedbacks] = useState<('none' | 'confirmed' | 'rejected')[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [monthCode, setMonthCode] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ limit: number; remaining: number; reset: number; } | null>(null);
  const pendingSearches = useRef<Set<number>>(new Set());
  const searchTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Dynamic prices data based on cookie
  const [currentPricesData, setCurrentPricesData] = useState<PriceEntry[]>([]);

  // Load Google Maps JS API once and share the promise across calls
  const loadGoogleMaps = (): Promise<void> => {
    if (typeof window === 'undefined') return Promise.reject('window is undefined');
    // If already loaded, resolve immediately
    if (window.google && window.google.maps && window.google.maps.places) {
      return Promise.resolve();
    }
    // Re-use the same promise if a previous call is already loading the script
    if ((window as any)._googleMapsPromise) {
      return (window as any)._googleMapsPromise;
    }

    (window as any)._googleMapsPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });

    return (window as any)._googleMapsPromise;
  };

  // Generate month code on client side only and load prices data
  useEffect(() => {
    const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    setMonthCode(`${months[new Date().getMonth()]}50`);
    setIsClient(true);
    
    // Load the appropriate prices data based on cookie
    const pricesData = getPricesData();
    setCurrentPricesData(pricesData);
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

  // Filter product configuration based on onlyStand prop
  const filteredProductConfig = onlyStand 
    ? { stand_only: productConfig.stand_only }
    : productConfig;

  const currentProductConfig = productConfig[currentProductId as keyof typeof productConfig];

  // Find price entry based on quantity and product type
  const findPriceEntry = (numberOfStands: number): PriceEntry | null => {
    if (!currentProductConfig || currentPricesData.length === 0) return null;

    // For local_seo and full_service, always use 3 stands
    const standsToFind = (currentProductConfig.local_seo === 1 || currentProductConfig.full_service === 1) ? 3 : numberOfStands;

    return currentPricesData.find(entry => 
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

          const transactionId = getOrCreateTransactionId();

          (window as any).dataLayer.push({
            event: 'add_to_cart',
            product_name: currentProductConfig.name,
            product_id: currentProductId,
          });
          console.log('✅ GTM - add_to_cart event pushed to dataLayer');
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

  // Update business data when quantity changes
  useEffect(() => {
    if (quantity > businessData.length) {
      const newBusinessData = [...businessData];
      while (newBusinessData.length < quantity) {
        const first = newBusinessData[0] || { businessName: '', postcode: '', businessCountry: 'España' };
        newBusinessData.push({
          businessName: first.businessName,
          postcode: first.postcode,
          businessCountry: first.businessCountry,
          copyFromFirst: true
        });
      }
      setBusinessData(newBusinessData);
    } else if (quantity < businessData.length) {
      setBusinessData(businessData.slice(0, quantity));
    }
  }, [quantity, businessData.length]);

  useEffect(() => {
    const fetchRateLimit = async () => {
      try {
        const response = await fetch('/api/geolocation-rate-limit', {
          method: 'GET'
        });
        if (response.ok) {
          const data = await response.json();
          setRateLimitInfo(data);

          // Log rate limit info to console
          console.log(`📊 Búsquedas restantes: ${data.remaining} / 20`);
        } else {
          console.error('Failed to fetch rate limit info:', response.status);
          setSearchError('Error al obtener información del límite de búsqueda.');
        }
      } catch (error) {
        console.error('Error fetching rate limit info:', error);
        setSearchError('Error al obtener información del límite de búsqueda.');
      }
    };

    if (isOpen) {
      fetchRateLimit();
    }
  }, [isOpen]);

  const searchBusiness = async (businessIndex: number = 0) => {
    if (!isOpen || !businessData[businessIndex]?.businessName || !businessData[businessIndex]?.postcode) return;

    // Check rate limit before performing search
    try {
      const rateLimitResponse = await fetch('/api/geolocation-rate-limit', {
        method: 'POST'
      });

      if (!rateLimitResponse.ok) {
        const errorData = await rateLimitResponse.json();
        setSearchError(errorData.error || 'Has alcanzado el límite de búsquedas. Intenta de nuevo más tarde.');
        return;
      }

      const rateLimitData = await rateLimitResponse.json();
      if (!rateLimitData.allowed) {
        setSearchError(rateLimitData.error || 'Has alcanzado el límite de búsquedas. Intenta de nuevo más tarde.');
        return;
      }

      // Update rate limit info
      const newRateLimitInfo = {
        limit: 20,
        remaining: rateLimitData.remaining,
        reset: rateLimitData.resetTime
      };
      setRateLimitInfo(newRateLimitInfo);

      // Log rate limit info to console
      console.log(`📊 Búsquedas restantes: ${newRateLimitInfo.remaining} / ${newRateLimitInfo.limit}`);

    } catch (error) {
      console.error('Error checking rate limit:', error);
      setSearchError('Error al verificar el límite de búsquedas.');
      return;
    }

    // Update searching state for specific business
    setIsSearching(prev => {
      const newState = [...prev];
      newState[businessIndex] = true;
      return newState;
    });
    setSearchError(null);
    setUserFeedbacks(prev => {
      const newState = [...prev];
      newState[businessIndex] = 'none';
      return newState;
    });

    const performSearch = (targetBusinessIndex: number) => {
      // Wait until the map container div has been rendered and its ref is set
      if (!mapRefs.current[targetBusinessIndex]) {
        // Retry shortly – this usually means React hasn't committed the ref yet
        setTimeout(() => performSearch(targetBusinessIndex), 100);
        return;
      }

      try {
        // Clear any existing timeout for this business
        if (searchTimeouts.current.has(targetBusinessIndex)) {
          clearTimeout(searchTimeouts.current.get(targetBusinessIndex)!);
          searchTimeouts.current.delete(targetBusinessIndex);
        }

        // Set a new timeout for this business
        const timeout = setTimeout(() => {
          // Clear from pending searches on timeout
          pendingSearches.current.delete(targetBusinessIndex);
          searchTimeouts.current.delete(targetBusinessIndex);
          setIsSearching(prev => {
            const newState = [...prev];
            newState[targetBusinessIndex] = false;
            return newState;
          });
          console.log(`Search timeout: Business search timed out after 10 seconds for business ${targetBusinessIndex + 1}`);
        }, 10000); // 10 second timeout

        searchTimeouts.current.set(targetBusinessIndex, timeout);

        if (mapRefs.current[targetBusinessIndex] && businessData[targetBusinessIndex]) {
          const newMap = new window.google.maps.Map(mapRefs.current[targetBusinessIndex], {
            center: { lat: 40.4168, lng: -3.7038 }, // Madrid center
            zoom: 2,
          });

          // Update maps array
          setMaps(prev => {
            const newMaps = [...prev];
            newMaps[targetBusinessIndex] = newMap;
            return newMaps;
          });

          // Create Places service
          const placesService = new window.google.maps.places.PlacesService(newMap);

          // Search for the business
          const searchQuery = `${businessData[targetBusinessIndex]?.businessName} ${businessData[targetBusinessIndex]?.postcode} ${businessData[targetBusinessIndex]?.businessCountry}`;
          const request = {
            query: searchQuery,
            fields: ['name', 'geometry', 'place_id', 'formatted_address'],
          };

          placesService.textSearch(request, (results: any[], status: string) => {
            // Clear timeout and remove from pending searches
            if (searchTimeouts.current.has(targetBusinessIndex)) {
              clearTimeout(searchTimeouts.current.get(targetBusinessIndex)!);
              searchTimeouts.current.delete(targetBusinessIndex);
            }
            pendingSearches.current.delete(targetBusinessIndex);

            setIsSearching(prev => {
              const newState = [...prev];
              newState[targetBusinessIndex] = false;
              return newState;
            });

            if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                const place = results[0];
                setSelectedPlaces(prev => {
                  const newPlaces = [...prev];
                  newPlaces[targetBusinessIndex] = place;
                  return newPlaces;
                });

                // Center map on the place
                newMap.setCenter(place.geometry.location);
                newMap.setZoom(15);

                // Add marker
                if (markers[targetBusinessIndex]) {
                  markers[targetBusinessIndex].setMap(null);
                }
                const newMarker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map: newMap,
                  title: place.name,
                });
                setMarkers(prev => {
                  const newMarkers = [...prev];
                  newMarkers[targetBusinessIndex] = newMarker;
                  return newMarkers;
                });
              } else {
                console.log(`Business not found: No business found with the provided name and postcode for business ${targetBusinessIndex + 1}`);
              }
          });
        }
      } catch (error) {
        // Clear timeout and remove from pending searches
        if (searchTimeouts.current.has(targetBusinessIndex)) {
          clearTimeout(searchTimeouts.current.get(targetBusinessIndex)!);
          searchTimeouts.current.delete(targetBusinessIndex);
        }
        pendingSearches.current.delete(targetBusinessIndex);

        setIsSearching(prev => {
          const newState = [...prev];
          newState[targetBusinessIndex] = false;
          return newState;
        });
        setSearchError('Error al buscar el negocio. Por favor, inténtalo de nuevo.');
        console.error('Search error:', error);
      }
    };

    pendingSearches.current.add(businessIndex);

    try {
      await loadGoogleMaps();
      performSearch(businessIndex);
    } catch (error) {
      pendingSearches.current.delete(businessIndex);
      setIsSearching(prev => {
        const newState = [...prev];
        newState[businessIndex] = false;
        return newState;
      });
      setSearchError('Error al cargar Google Maps. Por favor, inténtalo de nuevo.');
      console.error('Maps loading error:', error);
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
        acceptPrivacyPolicy: false,
        acceptTermsAndConditions: false
      });
      setBusinessData([{
        businessName: '',
        postcode: '',
        businessCountry: 'España',
        copyFromFirst: false
      }]);
      setAppliedVoucher(null);
      setVoucherError(null);
      setShowVoucherInput(false);
      setSelectedPlaces([]);
      setUserFeedbacks([]);
      setSearchError(null);
      clearTransactionId();
      setRateLimitInfo(null);
      // Clear pending searches and timeouts
      pendingSearches.current.clear();
      searchTimeouts.current.forEach(timeout => clearTimeout(timeout));
      searchTimeouts.current.clear();
    }

    return () => {
      if ('initMap' in window) {
        delete (window as any).initMap;
      }
    };
  }, [isOpen]);

  const handleBusinessConfirmation = (businessIndex: number, confirmed: boolean) => {
    setUserFeedbacks(prev => {
      const newFeedbacks = [...prev];
      newFeedbacks[businessIndex] = confirmed ? 'confirmed' : 'rejected';
      return newFeedbacks;
    });

    // If the user says the suggested place is NOT their business, clear the selected place
    if (!confirmed) {
      setSelectedPlaces(prev => {
        const newPlaces = [...prev];
        newPlaces[businessIndex] = null;
        return newPlaces;
      });
    }
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
  };

  const handleBusinessChange = (index: number, field: keyof BusinessData, value: string | boolean) => {
    setBusinessData(prevBusinessData => {
      const newBusinessData = [...prevBusinessData];
      newBusinessData[index] = { ...newBusinessData[index], [field]: value };
      return newBusinessData;
    });

    // Reset user feedback when business name or postcode changes
    if (field === 'businessName' || field === 'postcode') {
      setUserFeedbacks(prev => {
        const newFeedbacks = [...prev];
        newFeedbacks[index] = 'none';
        return newFeedbacks;
      });
      setSelectedPlaces(prev => {
        const newPlaces = [...prev];
        newPlaces[index] = null;
        return newPlaces;
      });
      setSearchError(null);
    }
  };

  const copyBusinessData = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setBusinessData(prevBusinessData => {
      const newBusinessData = [...prevBusinessData];
      const sourceData = newBusinessData[fromIndex];
      newBusinessData[toIndex] = {
        ...newBusinessData[toIndex],
        businessName: sourceData.businessName,
        postcode: sourceData.postcode,
        businessCountry: sourceData.businessCountry
      };
      return newBusinessData;
    });
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

    // Check if all selected colors are in stock
    const hasOutOfStockItems = stands.some(stand => {
      const stockInfo = stockData.stands[stand.color as keyof typeof stockData.stands];
      return !stockInfo?.inStock;
    });

    if (hasOutOfStockItems) {
      alert('Algunos de los colores seleccionados están sin stock. Por favor, selecciona otros colores disponibles.');
      return;
    }

    // Check if all required fields are filled
    const isFormValid = 
      formData.email &&
      formData.phone &&
      formData.acceptPrivacyPolicy &&
      formData.acceptTermsAndConditions;

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

        const transactionId = getOrCreateTransactionId();

        const hashedEmailValue = await hashEmail(formData.email);
        const hashedPhoneValue = await hashPhone(formData.phone);

        // Store product_id in sessionStorage for use in purchase event
        sessionStorage.setItem('product_id', currentProductId);

        (window as any).dataLayer.push({
          event: 'proceedToStripe',
          product_name: currentProductConfig.name,
          product_id: currentProductId,
          quantity: quantity,
          value: calculateTotal(),
          currency: 'EUR',
          hashed_customer_email: hashedEmailValue,
          hashed_customer_phone: hashedPhoneValue,
          transaction_id: transactionId,
          event_id: generateEventId(),
        });
        console.log('✅ GTM - proceedToStripe event pushed to dataLayer');
      }

      // Get UTM parameters for database storage
      const utmParams = getStoredUTMParameters() || {};

      // Prepare order data for database storage
      // Build all businesses array, copying data from first business when requested
      const allBusinesses = businessData.map((business, index) => {
        const source = business.copyFromFirst ? businessData[0] : business;
        return {
          business_number: index + 1,
          business_name: source.businessName || '',
          business_postcode: source.postcode || '',
          business_country: source.businessCountry || 'España',
          google_business_id: business.copyFromFirst ? (selectedPlaces[0]?.place_id || null) : (selectedPlaces[index]?.place_id || null),
          copy_from_first: business.copyFromFirst || false
        };
      });

      const orderDataForDB = {
        product_name: currentProductConfig.name,
        product_id: currentProductId,
        quantity: quantity,
        price: currentPriceEntry.price,
        discount_amount: appliedVoucher ? (currentPriceEntry.price * appliedVoucher.discount_percentage / 100) : 0,
        voucher_code: appliedVoucher?.code || null,
        customer_email: formData.email,
        customer_phone: formData.phone,
        business_name: businessData[0]?.businessName || '',
        business_postcode: businessData[0]?.postcode || '',
        business_country: businessData[0]?.businessCountry || 'España',
        google_business_id: selectedPlaces[0]?.place_id || null,
        stand_colors: stands,
        utm_params: utmParams,
        // Include all business data for multiple businesses
        all_businesses: allBusinesses
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
        businessName: businessData[0]?.businessName || '',
        businessPostcode: businessData[0]?.postcode || '',
        businessCountry: businessData[0]?.businessCountry || 'España',
        email: formData.email,
        phoneNumber: formData.phone,
        googleBusinessId: selectedPlaces[0]?.place_id || null
      };

      // Skip email sending during preorder - emails will be sent after payment confirmation
      console.log('⏭️ Skipping email during preorder - will send confirmation after payment');

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
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
            <div className={`grid gap-4 pt-4 ${onlyStand ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
              {Object.entries(filteredProductConfig).map(([productId, config]) => {
                // Find price for this specific product - use correct number of stands
                const standsToLookFor = (config.local_seo === 1 || config.full_service === 1) ? 3 : 1;
                const productPriceEntry = currentPricesData.find((entry: PriceEntry) => 
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
                        {appliedVoucher ? (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500 line-through">
                              {productPriceEntry.price.toFixed(2)}€{(config.local_seo === 1 || config.full_service === 1) ? '/mes' : ''}
                            </p>
                            <p className="text-[#7f6d2a] font-bold">
                              {(productPriceEntry.price - (productPriceEntry.price * appliedVoucher.discount_percentage / 100)).toFixed(2)}€{(config.local_seo === 1 || config.full_service === 1) ? '/mes' : ''}
                            </p>
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              -{appliedVoucher.discount_percentage}%
                            </span>
                          </div>
                        ) : (
                          <p className="text-[#7f6d2a] font-bold">
                            {productPriceEntry.price.toFixed(2)}€{(config.local_seo === 1 || config.full_service === 1) ? '/mes' : ''}
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
                      {['blanco', 'negro'].map((color) => {
                        const isOutOfStock = !stockData.stands[color as keyof typeof stockData.stands]?.inStock;
                        const isDisabled = isOutOfStock;
                        const buttonClass = `px-3 py-1 rounded-lg border transition-colors text-sm ${
                          stand.color === color
                            ? 'bg-[#7f6d2a] text-white border-[#7f6d2a]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#7f6d2a]'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) {
                                handleStandColorChange(index, color);
                              }
                            }}
                            className={buttonClass}
                            disabled={isDisabled}
                          >
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                            {isOutOfStock && <span className="ml-1">(Agotado)</span>}
                          </button>
                        );
                      })}
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
          </div>

          {/* Business Data Sections */}
          {businessData.map((business, index) => (
            <div key={index} className="border-2 border-[#7f6d2a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#7f6d2a]">
                  Negocio #{index + 1}
                </h3>
                {index > 0 && (
                  <div className="flex items-center space-x-2">
                                         <label className="flex items-center text-sm text-gray-600">
                       <input
                         type="checkbox"
                         checked={business.copyFromFirst || false}
                         onChange={(e) => {
                           const isChecked = e.target.checked;
                           handleBusinessChange(index, 'copyFromFirst', isChecked);
                           if (isChecked) {
                             copyBusinessData(0, index);
                           }
                         }}
                         className="mr-2 w-4 h-4 text-[#7f6d2a] bg-gray-100 border-gray-300 rounded focus:ring-[#7f6d2a] focus:ring-2"
                       />
                       Mismos datos que Negocio #1
                     </label>
                  </div>
                )}
              </div>

                             <div className="space-y-4">
                 {/* Business Fields */}
                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Nombre del Negocio *
                       </label>
                       <input
                         type="text"
                         value={business.businessName}
                         onChange={(e) => handleBusinessChange(index, 'businessName', e.target.value)}
                         required={index === 0}
                         disabled={index > 0 && business.copyFromFirst}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent disabled:bg-gray-100"
                         placeholder="Nombre de tu negocio"
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Código Postal del Negocio *
                       </label>
                       <input
                         type="text"
                         value={business.postcode}
                         onChange={(e) => handleBusinessChange(index, 'postcode', e.target.value)}
                         required={index === 0}
                         disabled={index > 0 && business.copyFromFirst}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent disabled:bg-gray-100"
                         placeholder="28001"
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       País del Negocio *
                     </label>
                     <input
                       type="text"
                       value={business.businessCountry}
                       onChange={(e) => handleBusinessChange(index, 'businessCountry', e.target.value)}
                       required={index === 0}
                       disabled={index > 0 && business.copyFromFirst}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7f6d2a] focus:border-transparent disabled:bg-gray-100"
                       placeholder="España"
                     />
                   </div>

                   {/* Search Business Button */}
                   <div className="flex justify-center">
                     <button
                       type="button"
                       onClick={() => {
                         if (!business.copyFromFirst && business.businessName && business.postcode) {
                           searchBusiness(index);
                         }
                       }}
                       disabled={
                         isSearching[index] || 
                         !business.businessName || 
                         !business.postcode || 
                         (index > 0 && business.copyFromFirst)
                       }
                       className="px-6 py-2 bg-[#7f6d2a] text-white rounded-lg hover:bg-[#6a5a23] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                     >
                       {isSearching[index] ? (
                         <>
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Buscando...
                         </>
                       ) : (
                         <>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                           </svg>
                           <span>Buscar negocio</span>
                         </>
                       )}
                     </button>
                   </div>
                 </div>

                                  {/* Map Section for each business */}
                 <div>
                   {/* Business Search Status */}
                   {businessData[index]?.businessName && businessData[index]?.postcode && isSearching[index] && (
                     <div className="text-center py-2 mb-4">
                       <p className="text-gray-600">Buscando tu negocio...</p>
                     </div>
                   )}

                   {/* Business Search Map */}
                   {(isSearching[index] || selectedPlaces[index]) && (
                     <div className="space-y-4">
                       {selectedPlaces[index] && <h4 className="font-medium text-gray-700">¿Es este tu negocio?</h4>}
                       <div ref={el => { mapRefs.current[index] = el; }} className="w-full h-64 rounded-lg border" />

                       {selectedPlaces[index] && userFeedbacks[index] === 'none' && (
                         <div className="bg-[#7f6d2a]/10 border border-[#7f6d2a]/30 rounded-lg p-4">
                           <h5 className="font-semibold text-[#7f6d2a] mb-2">{selectedPlaces[index].name}</h5>
                           <p className="text-sm text-[#7f6d2a]/80 mb-4">{selectedPlaces[index].formatted_address}</p>

                           <div className="grid grid-cols-2 gap-x-3 gap-y-1 items-start max-w-[500px]">
                             <button
                               type="button"
                               onClick={() => handleBusinessConfirmation(index, true)}
                               className="px-4 py-2 bg-[#7f6d2a] text-white rounded-lg hover:bg-[#6a5a23] transition-colors text-sm font-medium"
                             >
                               Sí, es mi negocio
                             </button>
                             <button
                               type="button"
                               onClick={() => handleBusinessConfirmation(index, false)}
                               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                             >
                               No, no es mi negocio
                             </button>
                             {/* empty cell to keep grid alignment */}
                             <div></div>
                             <div className="text-xs text-[#7f6d2a]/70 italic">
                               (No pasa nada. Nosotros nos encargaremos de encontrarlo por ti.)
                             </div>
                           </div>
                         </div>
                       )}

                       {/* eslint-disable-next-line @typescript-eslint/comparison-style */}
                       {selectedPlaces[index] && userFeedbacks[index] === 'confirmed' && (
                         <div className="bg-green-50 border border-green-200 rounded-lg p-4 relative">
                           <button
                             type="button"
                             onClick={() => setUserFeedbacks(prev => {
                               const newFeedbacks = [...prev];
                               newFeedbacks[index] = 'none';
                               return newFeedbacks;
                             })}
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
                           <p className="font-medium text-green-800">{selectedPlaces[index].name}</p>
                           <p className="text-sm text-green-600">{selectedPlaces[index].formatted_address}</p>
                         </div>
                       )}

                       {/* eslint-disable-next-line @typescript-eslint/comparison-style */}
                       {userFeedbacks[index] === 'rejected' && (
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
                 </div>
              </div>
            </div>
          ))}

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
                  'Proceder al Pago y Dirección de Envío'
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