"use client";

import { MapPinIcon, MagnifyingGlassIcon, TrophyIcon, ChartBarIcon, StarIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import localSeoIcon from "./seo_local.png";
import standLocalSeo from "../Products/stand_local_seo.png";

export default function LocalSEO() {
  return (
    <section id="local-seo" className="py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Visibilidad en Google Maps</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Optimizamos tu ficha de Google My Business para que aparezcas en las primeras posiciones cuando tus clientes te busquen en Google Maps. 
            Aumenta tu visibilidad local y atrae más clientes a tu negocio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">¿Qué es el Local SEO?</h3>
            <p className="text-lg text-gray-600 mb-6">
              El Local SEO es la optimización de tu presencia online para aparecer en los resultados de búsqueda local. 
              Cuando alguien busca tu tipo de negocio cerca de su ubicación, tu empresa aparecerá entre los primeros resultados.
            </p>
            <div className="space-y-4">
              {[
                "Optimización completa de Google My Business",
                "Gestión de reseñas y respuestas",
                "Creación de contenido local relevante",
                "Análisis de competencia local",
                "Informes mensuales de rendimiento"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-[#7f6d2a] rounded-full mr-3"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src={localSeoIcon}
                alt="Local SEO Icon"
                width={700}
                height={700}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Aparece en Google Maps",
              description: "Tu negocio aparecerá en los primeros resultados cuando alguien busque en su zona",
              icon: MapPinIcon,
              stat: "3x más visible"
            },
            {
              title: "Más Búsquedas Locales",
              description: "Atraemos clientes que buscan exactamente lo que ofreces en tu área",
              icon: MagnifyingGlassIcon,
              stat: "+150% búsquedas"
            },
            {
              title: "Supera a la Competencia",
              description: "Destacamos tu negocio por encima de competidores en tu zona",
              icon: TrophyIcon,
              stat: "Top 3 posiciones"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <feature.icon className="w-12 h-12 text-[#7f6d2a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="text-lg font-semibold text-[#7f6d2a]">{feature.stat}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Local SEO + Expositores NFC = Resultados Garantizados</h3>
              <p className="text-lg text-gray-600 mb-6">
                Combinamos la visibilidad online con la recopilación física de reseñas. 
                Mientras mejoramos tu posicionamiento en Google Maps, nuestros expositores NFC 
                te ayudan a conseguir más reseñas de 5 estrellas.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <ChartBarIcon className="w-8 h-8 text-[#7f6d2a] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">+300%</div>
                  <div className="text-sm text-gray-600">Visibilidad online</div>
                </div>
                <div className="text-center">
                  <StarIcon className="w-8 h-8 text-[#7f6d2a] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">4.8★</div>
                  <div className="text-sm text-gray-600">Puntuación media</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={standLocalSeo}
                  alt="Expositor NFC con Local SEO"
                  width={300}
                  height={300}
                  className="w-full h-auto max-w-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#7f6d2a] to-amber-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¿Listo para dominar Google Maps en tu zona?</h3>
          <p className="text-lg opacity-90 mb-6">
            Nuestro equipo de expertos en Local SEO está preparado para hacer que tu negocio sea el primero que vean tus clientes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold">✓ Configuración en 24-48h</span>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold">✓ Resultados en 30 días</span>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold">✓ Soporte continuo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 