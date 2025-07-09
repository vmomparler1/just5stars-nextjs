"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import standsImage from "./stand_02.png";
import localSeoIcon from "./stand_local_seo.png";
import allInclusive from "./stand_local_seo_360.png";
import { useEffect, useState } from "react";

const getMonthName = () => {
  const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  return months[new Date().getMonth()];
};

const getDaysLeftInMonth = () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate();
};

export default function Products() {
  const [daysLeft, setDaysLeft] = useState(getDaysLeftInMonth());
  const monthCode = `${getMonthName()}50`;

  useEffect(() => {
    // Update days left every day at midnight
    const timer = setInterval(() => {
      setDaysLeft(getDaysLeftInMonth());
    }, 86400000); // 24 hours in milliseconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="products" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Sólo Expositor NFC con código QR",
              description: "Consigue más reseñas en Google con nuestros expositores NFC.",
              image: standsImage,
              price: "39,90 €",
              cta_text: "Comprar Ahora",
              label: {
                text: "Más vendido",
                color: "#adadad"
              },
              features: ["Tecnología NFC + Código QR", 
                "Preconfigurado a tu perfil de Google Business", 
                "Chip NFC NTAG216 de alta calidad compatible con la mayoría de dispositivos Android e iOS", 
                "Construcción resistente de alta calidad"]
            },
            {
              title: "Expositor + Pack Visibilidad en Google Maps",
              description: "La combinación perfecta para posicionar tu negocio en Google Maps.",
              image: localSeoIcon,
              price: "99,90 €/mes",
              cta_text: "Comprar Ahora",
              label: {
                text: "Mejor calidad precio",
                color: "#7f6d2a"
              },
              features: ["Tecnología NFC + Código QR", 
                "Preconfigurado a tu perfil de Google Business", 
                "Chip NFC NTAG216 de alta calidad compatible con la mayoría de dispositivos Android e iOS", 
                "Construcción resistente de alta calidad", 
                "Auditoría inicial de tu perfil de Google Business", 
                "Recomendaciones para mejorar el posicionamiento en Google Maps", 
                "Seguimiento de la evolución en el ranking"]
            },
            {
              title: "Gestión 360 Digital | Visibilidad Google Maps + Web",
              description: "Delega la gestión de tu presencia digital a nuestros expertos.",
              image: allInclusive,
              price: "199,90 €/mes",
              cta_text: "Comprar Ahora",
              features: ["Tecnología NFC + Código QR", 
                "Preconfigurado a tu perfil de Google Business", 
                "Chip NFC NTAG216 de alta calidad compatible con la mayoría de dispositivos Android e iOS", 
                "Construcción resistente de alta calidad", 
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
              <button className="w-full bg-[#7f6d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors mt-auto">
                {product.cta_text}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 