"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FeaturedIn from "../components/FeaturedIn";
import { NFCExpositors } from "../components/NFCExpositors";
import VideoSection from "../components/VideoSection";
import SuccessStories from "../components/SuccessStories";
import Footer from "../components/Footer";
import { DiscountRibbon } from "../components/DiscountRibbon";
import { WhatsAppButton } from "../components/WhatsAppButton";
import CookiesBanner from "../components/CookiesBanner";
import Image from "next/image";
import { StarIcon, CheckIcon, ChevronRightIcon, BuildingStorefrontIcon, ChartBarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { PhoneIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import heroImage from "./stands.webp";

// Custom Hero component for Cadenas y Franquicias
function ChainsFranchisesHero() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium">
              <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
              Para Cadenas y Franquicias (+5 tiendas)
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Más Reseñas para tus
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Cadenas o Franquicias</span>
            </h1>
            <div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gestiona todos tus expositores NFC desde un portal centralizado. Controla múltiples ubicaciones y analiza el rendimiento de cada punto de venta.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Expositores NFC de alta calidad NTAG-216</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Plataforma web para gestionar los expositores incluída</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Seguimiento de escaneos por tienda</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-lg">Reprograma los expositores para que apunten a otra tienda las veces que quieras</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToContact}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center group"
              >
                Solicitar Información
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <Image
                src={heroImage}
                alt="Portal just5stars para Cadenas y Franquicias"
                width={500}
                height={500}
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

// Portal Features Section
function PortalFeatures() {
  const features = [
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Analíticas Centralizadas",
      description: "Ve el rendimiento de todos tus expositores desde un único dashboard. Estadísticas de escaneos, ubicaciones más activas y tendencias."
    },
    {
      icon: <MapPinIcon className="w-8 h-8" />,
      title: "Gestión por Ubicación",
      description: "Organiza y gestiona tus expositores por tienda, ciudad o región. Control total sobre tu red de puntos de venta."
    },
    {
      icon: <BuildingStorefrontIcon className="w-8 h-8" />,
      title: "Multi-Franquicia",
      description: "Perfecto para franquicias con múltiples ubicaciones. Cada franquiciado puede gestionar sus propios expositores."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            El Portal que Necesita tu Cadena
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Diseñado específicamente para empresas con múltiples ubicaciones que necesitan 
            gestionar y analizar el rendimiento de sus expositores NFC de forma centralizada.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Form Section
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    stores: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Consulta Portal Cadenas y Franquicias - ${formData.company || 'Sin empresa'}`
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          stores: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Solicita Información Personalizada
          </h2>

        </div>

        <div className="grid lg:grid-cols-1 gap-12">

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Formulario de Contacto</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">¡Mensaje enviado con éxito!</p>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Nos pondremos en contacto contigo lo antes posible para hablar sobre tu cadena.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <XMarkIcon className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-800 font-medium">Error al enviar el mensaje</p>
                </div>
                <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa/Cadena *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Nombre de tu cadena o franquicia"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Tiendas/Ubicaciones *
                </label>
                <select
                  value={formData.stores}
                  onChange={(e) => handleInputChange('stores', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="">Selecciona el número de ubicaciones</option>
                  <option value="5-10 tiendas">5-10 tiendas</option>
                  <option value="11-25 tiendas">11-25 tiendas</option>
                  <option value="26-50 tiendas">26-50 tiendas</option>
                  <option value="51-100 tiendas">51-100 tiendas</option>
                  <option value="Más de 100 tiendas">Más de 100 tiendas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Cuéntanos sobre tu cadena y cómo podemos ayudarte..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  'Solicitar Información'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CadenasFranquiciasPage() {
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client side before running any client-specific logic
  useEffect(() => {
    setMounted(true);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://just5stars.com/cadenas-franquicias#portal-service",
        "name": "Portal just5stars para Cadenas y Franquicias",
        "description": "Portal centralizado para gestionar expositores NFC en múltiples ubicaciones. Perfecto para cadenas y franquicias con más de 5 tiendas.",
        "provider": {
          "@type": "Organization",
          "name": "just5stars"
        },
        "serviceType": "Software de Gestión",
        "features": [
          "Portal centralizado para gestionar todos los expositores",
          "Analíticas detalladas por ubicación y dispositivo", 
          "Seguimiento de escaneos en tiempo real",
          "Gestión de múltiples franquicias desde una cuenta"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://just5stars.com/cadenas-franquicias",
        "name": "Portal just5stars para Cadenas y Franquicias",
        "description": "Gestiona todos tus expositores NFC desde un portal centralizado. Perfecto para cadenas y franquicias con múltiples ubicaciones.",
        "url": "https://just5stars.com/cadenas-franquicias"
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
        <ChainsFranchisesHero />

        <PortalFeatures />
        <NFCExpositors />
        <ContactSection />
        <FeaturedIn />
        <Footer />
        <WhatsAppButton />
        <CookiesBanner />
      </main>
    </>
  );
}