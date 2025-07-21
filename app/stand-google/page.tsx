"use client";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedIn from "../components/FeaturedIn";
import Products from "../components/Products";
import { NFCExpositors } from "../components/NFCExpositors";
import SuccessStories from "../components/SuccessStories";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { DiscountRibbon } from "../components/DiscountRibbon";
import { WhatsAppButton } from "../components/WhatsAppButton";
import CookiesBanner from "../components/CookiesBanner";
import Image from "next/image";
import { StarIcon, CheckIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import heroImage from "../components/Hero/hero_just5.png";


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
              Especialistas en Reseñas de Google
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Expositores
              <br />
              <span className="bg-gradient-to-r from-[#7f6d2a] to-[#fec700] bg-clip-text text-transparent">Google</span>
              <br />
              NFC
            </h1>
            <div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Consigue más reseñas de 5 estrellas en Google con nuestros expositores NFC. Simple, efectivo y elegante.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Tecnología NFC de última generación</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Funcionamiento con QR como respaldo</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Configuración personalizada incluida</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-3" />
                  <span className="text-lg">Aumenta reseñas hasta un 300%</span>
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
                alt="Expositores NFC para Google"
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

export default function StandGooglePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "https://just5stars.com/stand-google#product-stand-only",
        "name": "Expositor NFC con código QR",
        "description": "Consigue más reseñas en Google con nuestros expositores NFC. Tecnología NFC + Código QR preconfigurado a tu perfil de Google Business.",
        "brand": {
          "@type": "Brand",
          "name": "Just5Stars"
        },
        "category": "Marketing Digital",
        "offers": {
          "@type": "Offer",
          "url": "https://just5stars.com/stand-google",
          "priceCurrency": "EUR",
          "price": "39.80",
          "priceValidUntil": "2024-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Just5Stars"
          }
        },
        "features": [
          "Tecnología NFC + Código QR",
          "Preconfigurado a tu perfil de Google Business"
        ]
      },
      {
        "@type": "Product",
        "@id": "https://just5stars.com/stand-google#product-stand-visibility",
        "name": "3 Expositores + Visibilidad en Google Maps",
        "description": "Incluye 3 expositores + gestión de tu visibilidad en Google Maps. Auditoría inicial, recomendaciones y seguimiento incluidos.",
        "brand": {
          "@type": "Brand",
          "name": "Just5Stars"
        },
        "category": "Marketing Digital",
        "offers": {
          "@type": "Offer",
          "url": "https://just5stars.com/stand-google",
          "priceCurrency": "EUR",
          "price": "59.80",
          "priceValidUntil": "2024-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Just5Stars"
          }
        },
        "features": [
          "3 Expositores con Tecnología NFC + Código QR",
          "Preconfigurado a tu perfil de Google Business",
          "Auditoría inicial de tu perfil de Google Business",
          "Recomendaciones para mejorar el posicionamiento en Google Maps",
          "Seguimiento de la evolución en el ranking"
        ]
      },
      {
        "@type": "Product",
        "@id": "https://just5stars.com/stand-google#product-stand-visibility-web",
        "name": "3 Expositores + Visibilidad en Google Maps + Web",
        "description": "Incluye 3 expositores + gestión completa de tu presencia digital. Servicio completo con creación y mantenimiento web más SEO.",
        "brand": {
          "@type": "Brand",
          "name": "Just5Stars"
        },
        "category": "Marketing Digital",
        "offers": {
          "@type": "Offer",
          "url": "https://just5stars.com/stand-google",
          "priceCurrency": "EUR",
          "price": "299.80",
          "priceValidUntil": "2024-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Just5Stars"
          }
        },
        "features": [
          "3 Expositores con Tecnología NFC + Código QR",
          "Preconfigurado a tu perfil de Google Business",
          "Auditoría inicial de tu perfil de Google Business",
          "Recomendaciones para mejorar el posicionamiento en Google Maps",
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
        <FeaturedIn />
        <NFCExpositors />
        <Products />
        <SuccessStories />
        <CTA />
        <Footer />
        <WhatsAppButton />
        <CookiesBanner />
      </main>
    </>
  );
} 