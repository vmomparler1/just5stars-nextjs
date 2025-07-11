"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import standsImage from "./stand_02.png";
import localSeoIcon from "./stand_local_seo.png";
import allInclusive from "./stand_local_seo_360.png";
import { OrderModal } from "../OrderModal";
import pricesData from '@/app/data/prices.json';

const getMonthName = () => {
  const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  return months[new Date().getMonth()];
};

const getDaysLeftInMonth = () => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const timeLeft = endOfMonth.getTime() - now.getTime();
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

export default function Products() {
  const [timeLeft, setTimeLeft] = useState(getDaysLeftInMonth());
  const monthCode = `${getMonthName()}50`;
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleOrderClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsOrderModalOpen(true);
  };

  // Get prices from prices.json
  const standOnlyPrice = pricesData.find(p => p.number_of_stands === 1 && p.local_seo === 0 && p.full_service === 0)?.price || 39.9;
  const localSeoPrice = pricesData.find(p => p.number_of_stands === 3 && p.local_seo === 1 && p.full_service === 0)?.price || 115.76;
  const fullServicePrice = pricesData.find(p => p.number_of_stands === 3 && p.local_seo === 0 && p.full_service === 1)?.price || 255.76;

  return (
    <>
      <div className="z-40 w-full bg-[#7f6d2a] text-white py-3 shadow-lg mt-[72px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center gap-4 md:gap-8">
            <div className="text-xl md:text-xl font-bold">¡Ahora con 50% de descuento!</div>
            <div className="text-base md:text-lg">
              Usa el código <span className="font-mono bg-white/20 px-2 py-1 rounded">{monthCode}</span>
            </div>
            <div className="text-sm md:text-base flex items-center gap-2">
              <span>Promoción válida hasta:</span>
              <div className="flex items-center gap-1 font-mono">
                <span className="py-1 rounded">{timeLeft.days} días,</span>
                <span className="py-1 rounded">{timeLeft.hours.toString().padStart(2, '0')}h</span>
                <span className="py-1 rounded">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
                <span className="py-1 rounded">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="products" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>

          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: "stand_only",
                title: "Sólo Expositor NFC con código QR",
                description: "Consigue más reseñas en Google con nuestros expositores NFC.",
                image: standsImage,
                price: `${standOnlyPrice.toFixed(2)}€`,
                cta_text: "Comprar Ahora",
                label: {
                  text: "Más vendido",
                  color: "#adadad"
                },
                features: ["Tecnología NFC + Código QR", 
                  "Preconfigurado a tu perfil de Google Business"]
              },
              {
                id: "stand_visibility",
                title: "3 Expositores + Visibilidad en Google Maps",
                description: "Incluye 3 expositores + gestión de tu visibilidad en Google Maps.",
                image: localSeoIcon,
                price: `${localSeoPrice.toFixed(2)}€ / mes`,
                cta_text: "Comprar Ahora",
                label: {
                  text: "Mejor calidad precio",
                  color: "#7f6d2a"
                },
                features: ["3 Expositores con Tecnología NFC + Código QR", 
                  "Preconfigurado a tu perfil de Google Business", 
                  "Auditoría inicial de tu perfil de Google Business", 
                  "Recomendaciones para mejorar el posicionamiento en Google Maps", 
                  "Seguimiento de la evolución en el ranking"]
              },
              {
                id: "stand_visibility_web",
                title: "3 Expositores + Visibilidad en Google Maps + Web",
                description: "Incluye 3 expositores + gestión completa de tu presencia digital.",
                image: allInclusive,
                price: `${fullServicePrice.toFixed(2)} € / mes`,
                cta_text: "Comprar Ahora",
                features: ["3 Expositores con Tecnología NFC + Código QR", 
                  "Preconfigurado a tu perfil de Google Business", 
                  "Auditoría inicial de tu perfil de Google Business", 
                  "Recomendaciones para mejorar el posicionamiento en Google Maps", 
                  "Seguimiento de la evolución en el ranking", 
                  "Creación y mantenimiento de la web", 
                  "SEO web"]
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative flex flex-col h-full">
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
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-[#7f6d2a] text-center">
                      {product.price}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => handleOrderClick(product.id)}
                  className="w-full bg-[#7f6d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors mt-auto"
                >
                  {product.cta_text}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedProductId={selectedProductId}
        onProductChange={(productId) => setSelectedProductId(productId)}
      />
    </>
  );
} 