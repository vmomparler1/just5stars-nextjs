
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface OrderInfo {
  order_id: string;
  customer_email: string;
  delivery_country: string;
  estimated_delivery_date: string;
  business_name: string;
  product_name: string;
  quantity: number;
  total_price: number;
  voucher_code?: string;
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f6d2a] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando información del pedido...</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Only run on client side after mount
    
    const checkoutSessionId = searchParams.get('chsid');
    
    if (!checkoutSessionId) {
      setError('No se encontró información del pedido');
      setLoading(false);
      return;
    }

    // Fetch order information
    const fetchOrderInfo = async () => {
      try {
        const response = await fetch(`/api/order-by-session?session_id=${checkoutSessionId}`);
        const data = await response.json();
        
        if (data.success) {
          setOrderInfo(data.order);
          
          // Push purchase event to dataLayer
          if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
              event: 'purchase',
              transaction_id: data.order.order_id,
              value: data.order.price - (data.order.discount_amount || 0),
              currency: 'EUR',
              product_name: data.order.product_name,
              product_id: data.order.product_id,
              quantity: data.order.quantity,
              customer_email: data.order.customer_email
            });
            console.log('✅ GTM - purchase event pushed to dataLayer');
          }
          
          // Load Google survey opt-in script after order info is loaded
          loadGoogleSurveyScript(data.order);
        } else {
          setError(data.error || 'Error al recuperar información del pedido');
        }
      } catch (err) {
        console.error('Error fetching order info:', err);
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [searchParams, mounted]);

  const loadGoogleSurveyScript = (order: OrderInfo) => {
    // Set up global renderOptIn function
    (window as any).renderOptIn = function() {
      (window as any).gapi.load('surveyoptin', function() {
        (window as any).gapi.surveyoptin.render({
          // REQUIRED FIELDS
          "merchant_id": 5558346653,
          "order_id": order.order_id,
          "email": order.customer_email,
          "delivery_country": order.delivery_country,
          "estimated_delivery_date": order.estimated_delivery_date,
          
          // OPTIONAL FIELDS - GTIN removed as it was causing validation errors
        });
      });
    };

    // Load Google Platform API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  };

  // Show loading state during SSR and initial client render to prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f6d2a] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando información del pedido...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !orderInfo) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar el pedido</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <a 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-[#7f6d2a] text-white rounded-lg hover:bg-[#6a5a23] transition-colors"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias por tu pedido!</h1>
              <p className="text-lg text-gray-600">
                Tu pedido ha sido procesado correctamente y recibirás un email de confirmación en breve.
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ID del pedido</p>
                  <p className="font-semibold text-gray-900">{orderInfo.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{orderInfo.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Producto</p>
                  <p className="font-semibold text-gray-900">{orderInfo.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cantidad</p>
                  <p className="font-semibold text-gray-900">{orderInfo.quantity} expositor{orderInfo.quantity > 1 ? 'es' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Negocio</p>
                  <p className="font-semibold text-gray-900">{orderInfo.business_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total pagado</p>
                  <p className="font-semibold text-[#7f6d2a] text-lg">€{orderInfo.total_price.toFixed(2)}</p>
                </div>
              </div>
              
              {orderInfo.voucher_code && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Descuento aplicado:</strong> {orderInfo.voucher_code}
                  </p>
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">📦 Información de envío</h3>
              <p className="text-blue-800 mb-2">
                <strong>Fecha estimada de entrega:</strong> {new Date(orderInfo.estimated_delivery_date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-blue-700 text-sm">
                Recibirás un email con la información de seguimiento cuando tu pedido sea enviado.
              </p>
            </div>

            {/* Next Steps */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos pasos</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#7f6d2a] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                  <p className="text-gray-700">Recibirás un email de confirmación con los detalles de tu pedido</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#7f6d2a] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                  <p className="text-gray-700">Prepararemos tu pedido y te enviaremos la información de seguimiento</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#7f6d2a] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                  <p className="text-gray-700">Recibirás tus expositores NFC en la dirección especificada</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#7f6d2a] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                  <p className="text-gray-700">Nuestro equipo se pondrá en contacto contigo para configurar tus servicios</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-gray-600 mb-4">¿Tienes alguna pregunta sobre tu pedido?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Contactar por email
                </a>
                <a 
                  href="https://wa.me/645061155" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}
