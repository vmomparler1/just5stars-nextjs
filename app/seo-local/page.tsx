"use client";

import Navbar from "../components/Navbar";
import FeaturedIn from "../components/FeaturedIn";
import Products from "../components/Products";
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

// Custom Hero component specifically for SEO Local
function SEOLocalHero() {
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
              SEO
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Local</span>
              <br />
              Google Maps
            </h1>
            <div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Aparecer en las primeras posiciones de Google Maps cuando tus clientes te busquen. Aumenta tu visibilidad local y atrae más clientes a tu negocio.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Optimización completa de Google My Business</span>
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
                alt="SEO Local Google Maps"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl shadow-2xl"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-center mb-4">
              <MagnifyingGlassIcon className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">+300%</div>
            <p className="text-gray-600">Aumento promedio en visibilidad local</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-center mb-4">
              <MapPinIcon className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">Top 3</div>
            <p className="text-gray-600">Posición media en Google Maps</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-center mb-4">
              <TrophyIcon className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">90 días</div>
            <p className="text-gray-600">Para ver resultados significativos</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SEOLocalPage() {
  return (
    <main>
      <Navbar />
      <DiscountRibbon />
      <SEOLocalHero />
      <FeaturedIn />
      <LocalSEO />
      <Products />
      <SuccessStories />
      <CTA />
      <Footer />
      <WhatsAppButton />
      <CookiesBanner />
    </main>
  );
} 