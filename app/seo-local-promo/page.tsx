"use client";

import Navbar from "../components/Navbar";
import FeaturedIn from "../components/FeaturedIn";
import LocalSEO from "../components/LocalSEO";
import SuccessStories from "../components/SuccessStories";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { DiscountRibbon } from "../components/DiscountRibbon";
import { WhatsAppButton } from "../components/WhatsAppButton";
import CookiesBanner from "../components/CookiesBanner";
import Image from "next/image";
import { MapPinIcon, CheckIcon, ChevronRightIcon, MagnifyingGlassIcon, TrophyIcon } from "@heroicons/react/24/outline";
import localSeoImage from "../components/LocalSEO/seo_local.png";
import localSeoIcon from "../components/Products/stand_local_seo.png";
import mapsIcon from "../components/Products/icon_local_seo _2.png";
import { OrderModal } from "../components/OrderModal";
import { useState, useEffect } from "react";
import vouchersData from "../data/vouchers.json";

// Custom Hero component specifically for SEO Local Promo
function SEOLocalPromoHero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium">
              <MapPinIcon className="w-4 h-4 mr-2" />
              Especialistas en Posicionamiento Local
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Oferta Exclusiva para Clientes:
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1 mes Gratis de SEO Local</span>
            </h1>
            <div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Mejora tu posicionamiento cuando tus clientes te busquen. Aumenta tu visibilidad local y atrae más clientes a tu negocio.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Optimización completa del Google Business Profile</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Estrategia de palabras clave locales</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Gestión de reseñas y reputación online</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Reportes mensuales de posicionamiento</span>
                </li>
              </ul>
              {/* Highlight the 30-day trial */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-lg font-semibold text-green-800">Prueba 30 días gratis, sin compromiso</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToProducts}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center group"
              >
                Ver Servicios SEO
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <Image
                src={localSeoImage}
                alt="SEO Local"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl shadow-2xl"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Custom Products component for the promo page
function SEOLocalPromoProducts() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  const handleOrderClick = (productId: string, voucherCode: string | null = null) => {
    setSelectedProductId(productId);
    setIsOrderModalOpen(true);
    if (voucherCode) {
      // Logic to apply voucher, e.g., pass it to the modal or redirect with it
      console.log(`Voucher ${voucherCode} applied`);
    }
  };

  useEffect(() => {
    setIsClient(true);
    // Find the voucher for the current month
    const today = new Date();
    const month = today.getMonth(); // 0-indexed
    const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
                       'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const currentMonthName = monthNames[month];

    // Access vouchers from the correct structure
    const currentMonthVoucher = vouchersData.vouchers.find(v => 
      v.code.startsWith(currentMonthName) && v.active
    );
    setCurrentVoucher(currentMonthVoucher || null);
  }, []);

  const product = {
    id: "stand_visibility_promo",
    title: "SEO Local en Google Maps",
    description: "Gestión completa de tu SEO Local para mejorar tu posicionamiento en Google Maps",
    image: mapsIcon,
    cta_text: "Comprar Ahora",
    originalPrice: 59.80,
    discountedPrice: 0,
    hasDiscount: true,
    monthlyText: "/primer mes",
    label: {
      text: "Oferta especial",
      color: "#7f6d2a"
    },
    secondary_label: {
      text: "Sin permanencia",
      color: "#7f6d2a"
    },
    features: [
      "Auditoría inicial de tu Google Business Profile",
      "Recomendaciones para mejorar el posicionamiento en Maps",
      "Seguimiento de la evolución en el ranking",
    ],
    // Dynamically set the payment URL with the voucher code if available
    paymentUrl: currentVoucher ? `https://buy.stripe.com/cN21479wX0qBblt3CD?voucher=${currentVoucher.code}` : "https://buy.stripe.com/9B6fZi7wX4umbktaTFc"
  };

  return (
    <>
      <section id="products" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ayudamos a tu negocio a crecer</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative flex flex-col h-full">
              {product.label && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span
                    className="text-white px-4 py-2 rounded-full text-sm font-bold"
                    style={{ backgroundColor: product.label.color }}
                  >
                    {product.label.text}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-center mb-6">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{product.title}</h3>
                <div className="mb-6">
                  {isClient && product.hasDiscount ? (
                    <div className="text-center space-y-2">
                      <div className="font-bold text-[#7f6d2a] py-2 px-4">
                        <span className="text-5xl">0</span>
                        <span className="text-2xl">€ primer mes</span>
                      </div>
                      <div className="text-gray-500">
                        <span className="text-xl">29,90</span>
                        <span className="text-base">€ siguientes meses</span>
                      </div>
                      <div className="text-gray-500 line-through">
                        <span className="text-xl">59,80</span>
                        <span className="text-base">€ siguientes meses</span>
                      </div>
                      {/* Discount and Permanencia in same row */}
                      <div className="flex justify-center items-center gap-3 flex-wrap">
                        <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                          -50% dto. este mes
                        </div>

                        {product.secondary_label && (
                          <span
                            className="text-[#7f6d2a] text-sm font-semibold px-3 py-1 rounded-full border border-[#7f6d2a]"
                          >
                            {product.secondary_label.text}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="font-bold text-[#7f6d2a] py-2 px-4">
                        <span className="text-5xl">{product.originalPrice.toFixed(2)}</span>
                        <span className="text-2xl">€{product.monthlyText}</span>
                      </div>
                      {product.secondary_label && (
                        <div className="mt-2">
                          <span
                            className="text-[#7f6d2a] text-sm font-semibold px-3 py-1 rounded-full border border-[#7f6d2a]"
                          >
                            {product.secondary_label.text}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    const baseUrl = "https://buy.stripe.com/9B6fZi7wX4umbktaTFcEw05";
                    const paymentUrl = currentVoucher 
                      ? `${baseUrl}?prefilled_promo_code=${currentVoucher.code}`
                      : baseUrl;
                    window.location.href = paymentUrl;
                  }}
                  className="w-full bg-[#7f6d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors mb-6"
                >
                  {product.cta_text}
                </button>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* WhatsApp Button added here */}
                <div className="text-center mt-4">
                  <button
                    onClick={() => {
                      const phoneNumber = '645061155';
                      const message = 'Hola! Tengo dudas sobre el servicio de SEO Local. ¿Podrían ayudarme?';
                      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    ¿Tienes dudas? Contáctanos por WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedProductId={selectedProductId}
        onProductChange={(productId) => setSelectedProductId(productId)}
        onlyStand={false}
      />
    </>
  );
}

export default function SEOLocalPromoPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "SEO Local en Google Maps",
    "description": "Servicio de SEO Local para mejorar el posicionamiento en Google Maps con prueba gratuita de 30 días.",
    "provider": {
      "@type": "Organization",
      "name": "just5stars",
      "url": "https://just5stars.com"
    },
    "serviceType": "SEO Local",
    "areaServed": {
      "@type": "Country",
      "name": "España"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://just5stars.com/seo-local-promo",
      "priceCurrency": "EUR",
      "price": "59.80",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <Navbar />
        <DiscountRibbon />
        <SEOLocalPromoHero />
        <FeaturedIn />
        <LocalSEO />
        <SEOLocalPromoProducts />
        <SuccessStories />
        <CTA />
        <Footer />
        <WhatsAppButton />
        <CookiesBanner />
      </main>
    </>
  );
}