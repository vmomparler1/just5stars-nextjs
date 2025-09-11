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
import { OrderModal } from "../components/OrderModal";
import { useState, useEffect } from "react";

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
              Pack de Visibilidad
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SEO Local</span>
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

  const handleOrderClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsOrderModalOpen(true);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const product = {
    id: "stand_visibility_promo",
    title: "SEO Local en Google Maps",
    description: "Gestión completa de tu SEO Local para mejorar tu posicionamiento en Google Maps",
    image: localSeoIcon,
    cta_text: "Comprar Ahora",
    originalPrice: 119.60,
    discountedPrice: 59.80,
    hasDiscount: true,
    monthlyText: "/mes",
    label: {
      text: "Oferta especial",
      color: "#7f6d2a"
    },
    secondary_label: {
      text: "Sin permanencia",
      color: "#7f6d2a"
    },
    features: [
      "Auditoría inicial de tu GBP",
      "Recomendaciones para mejorar el posicionamiento en Maps",
      "Seguimiento de la evolución en el ranking",
      "Prueba 30 días gratis, sin compromiso"
    ],
    paymentUrl: "https://buy.stripe.com/9B6fZi7wX4umbktaTFc"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>

                <div className="mb-6">
                  {isClient && product.hasDiscount ? (
                    <div className="text-center space-y-2">
                      <div className="font-bold text-[#7f6d2a] py-2 px-4">
                        <span className="text-5xl">{product.discountedPrice.toFixed(2)}</span>
                        <span className="text-2xl">€{product.monthlyText}</span>
                      </div>
                      <div className="text-gray-500 line-through">
                        <span className="text-xl">{product.originalPrice.toFixed(2)}</span>
                        <span className="text-base">€{product.monthlyText}</span>
                      </div>
                      {/* Discount and Permanencia in same row */}
                      <div className="flex justify-center items-center gap-3 flex-wrap">
                        <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                          -50% dto.
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

                {/* Move button here, right after price */}
                <button 
                  onClick={() => handleOrderClick(product.id)}
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