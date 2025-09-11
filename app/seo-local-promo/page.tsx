"use client";

import Hero from "@/app/components/Hero";
import Products from "@/app/components/Products";
import WhyJust5Stars from "@/app/components/WhyJust5Stars";
import SuccessStories from "@/app/components/SuccessStories";
import CTA from "@/app/components/CTA";
import { DiscountRibbon } from "../components/DiscountRibbon";
import { WhatsAppButton } from "../components/WhatsAppButton";
import CookiesBanner from "../components/CookiesBanner";
import Navbar from "../components/Navbar";
import FeaturedIn from "../components/FeaturedIn";
import LocalSEO from "../components/LocalSEO";
import Footer from "../components/Footer";
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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="absolute inset-0 bg-white/50"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🎯 Prueba 30 días gratis, sin compromiso
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            SEO Local en
            <span className="text-[#7f6d2a]"> Google Maps</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Potencia tu negocio local con SEO profesional. Mejora tu posicionamiento en Google Maps y atrae más clientes de tu zona.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="#products"
              className="bg-[#7f6d2a] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#6a5a23] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Empezar Ahora - 30 Días Gratis
            </a>
            <p className="text-sm text-gray-500">
              Sin permanencia • Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Custom Products component for the promo page
function SEOLocalPromoProducts() {
  return <Products onlyProduct="seo_local_only" />;
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