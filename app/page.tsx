
"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedIn from "./components/FeaturedIn";
import Products from "./components/Products";
import { NFCExpositors } from "./components/NFCExpositors";
import VideoSection from "./components/VideoSection";
import SuccessStories from "./components/SuccessStories";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { DiscountRibbon } from "./components/DiscountRibbon";
import { WhatsAppButton } from "./components/WhatsAppButton";
import CookiesBanner from "./components/CookiesBanner";
import Image from "next/image";
import { StarIcon, CheckIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import heroImage from "./components/Hero/hero_just5.png";
import { capturePriceParameter } from "./utils/priceTracking";


// Custom Hero component specifically for Google stands
function GoogleStandHero() {
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
    <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full text-[#7f6d2a] text-sm font-medium">
              <StarIcon className="w-4 h-4 mr-2" />
              Especialistas en Reseñas
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Expositor
              <br />
              <span className="bg-gradient-to-r from-[#7f6d2a] to-[#fec700] bg-clip-text text-transparent">Reseñas</span>
              <br />
              Google
              <br />
              NFC & QR
            </h1>
            <div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Acerca el móvil y tus clientes te dejan una reseña en Google en 5 segundos. Simple, efectivo y elegante.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Tecnología NFC de última generación (chip NFC)</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Funcionamiento con NFC & QR</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Configuración previa para que enlace a tu perfil de reseñas</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Un único pago</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">No requiere de aplicaciones</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToProducts}
                className="bg-[#7f6d2a] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#6d5d1a] transition-colors flex items-center justify-center group"
              >
                Ver Expositores
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <Image
                src={heroImage}
                alt="Expositores NFC para reseñas"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl shadow-2xl"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7f6d2a]/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ExpositorResenasNFCPage() {
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client side before running any client-specific logic
  useEffect(() => {
    setMounted(true);
  }, []);

  // Capture price parameter from URL when component mounts
  useEffect(() => {
    if (!mounted) return; // Only run on client side after mount

    // Capture price parameter when page loads
    capturePriceParameter();
  }, [mounted]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://just5stars.com/expositor-resenas-nfc#product-stand-only",
        "name": "Expositor Reseñas NFC & QR ",
        "description": "Con solo acercar el móvil, tus clientes acceden a tu perfil público de reseñas. Tecnología NFC + Código QR preconfigurado a tu perfil.",
        "brand": {
          "@type": "Brand",
          "name": "just5stars"
        },
        "category": "Marketing Digital",
        "offers": {
          "@type": "Offer",
          "url": "https://just5stars.com/expositor-resenas-nfc",
          "priceCurrency": "EUR",
          "price": "39.80",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "just5stars"
          }
        },
        "features": [
          "Tecnología NFC + Código QR",
          "Programado previamente para enlazar a tu página de reseñas"
        ]
      },
      {
        "@type": "Product",
        "@id": "https://just5stars.com/expositor-resenas-nfc#product-stand-visibility",
        "name": "3 Expositores + SEO Local",
        "description": "Incluye 3 expositores + gestión de tu SEO Local. Auditoría inicial, recomendaciones y seguimiento incluidos.",
        "brand": {
          "@type": "Brand",
          "name": "just5stars"
        },
        "category": "Marketing Digital",
        "offers": {
          "@type": "Offer",
          "url": "https://just5stars.com/expositor-resenas-nfc",
          "priceCurrency": "EUR",
          "price": "59.80",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Just5Stars"
          }
        },
        "features": [
          "3 Expositores con Tecnología NFC + Código QR",
          "Programado previamente para enlazar a tu página de reseñas",
          "Auditoría inicial de tu GBP",
          "Recomendaciones para mejorar el posicionamiento en Maps",
          "Seguimiento de la evolución en el ranking"
        ]
      },
      {
        "@type": "Product",
        "@id": "https://just5stars.com/expositor-resenas-nfc#product-stand-visibility-web",
        "name": "3 Expositores + SEO Local + Web",
        "description": "Incluye 3 expositores + gestión completa de tu presencia digital. Servicio completo con creación y mantenimiento web más SEO.",
        "brand": {
          "@type": "Brand",
          "name": "just5stars"
        },
        "category": "Marketing Digital",
        "offers": {
          "@type": "Offer",
          "url": "https://just5stars.com/expositor-resenas-nfc",
          "priceCurrency": "EUR",
          "price": "299.80",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "just5stars"
          }
        },
        "features": [
          "3 Expositores con Tecnología NFC + Código QR",
          "Programado previamente para enlazar a tu página de reseñas",
          "Auditoría inicial de tu perfil del GBP",
          "Recomendaciones para mejorar el posicionamiento Maps",
          "Seguimiento de la evolución en el ranking",
          "Creación y mantenimiento de la web",
          "SEO web"
        ]
      }
    ]
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
        <GoogleStandHero />

        <NFCExpositors />
        <Products onlyStand={true} />
        <VideoSection />
        <SuccessStories />
        <FeaturedIn />
        <CTA />
        <Footer />
        <WhatsAppButton />
        <CookiesBanner />
      </main>
    </>
  );
}
