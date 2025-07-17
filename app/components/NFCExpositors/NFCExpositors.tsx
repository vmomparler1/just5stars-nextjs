"use client";

import { StarIcon, DevicePhoneMobileIcon, QrCodeIcon, ShieldCheckIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import standWhite1 from "./stand_white_1.png";
import standWhite2 from "./stand_white_2.webp";
import standWhite3 from "./stand_white_3.webp";
import standWhite4 from "./stand_white_4.gif";
import standGoogleBlack from "./stand_google_black.png";
import blackStandDimensions from "./black_stand_dimensions.webp";

export default function NFCExpositors() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<'white' | 'black'>('white');
  
  const getImages = () => {
    if (selectedColor === 'black') {
      return [
        { src: standGoogleBlack, alt: "Expositor NFC negro - Vista 1" },
        { src: blackStandDimensions, alt: "Expositor NFC negro - Dimensiones" },
        { src: standWhite3, alt: "Expositor NFC blanco - Vista 3" },
        { src: standWhite4, alt: "Expositor NFC blanco - Animación" }
      ];
    }
    return [
      { src: standWhite1, alt: "Expositor NFC blanco - Vista 1" },
      { src: standWhite2, alt: "Expositor NFC blanco - Vista 2" },
      { src: standWhite3, alt: "Expositor NFC blanco - Vista 3" },
      { src: standWhite4, alt: "Expositor NFC blanco - Animación" }
    ];
  };

  const images = getImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleColorChange = (color: 'white' | 'black') => {
    setSelectedColor(color);
    setCurrentImageIndex(0); // Reset to first image when color changes
  };

  return (
    <section id="nfc-expositors" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Expositores NFC para Reseñas en Google</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revoluciona la forma en que recopilas reseñas de Google con nuestros expositores NFC de última generación. 
            Simplicidad, elegancia y resultados garantizados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              title: "Tecnología NFC Avanzada",
              description: "Chips NTAG216 de alta calidad compatibles con la mayoría de dispositivos Android e iOS",
              icon: DevicePhoneMobileIcon,
              stat: "99% Compatibilidad"
            },
            {
              title: "Doble Funcionalidad",
              description: "Combina tecnología NFC con códigos QR para máxima accesibilidad",
              icon: QrCodeIcon,
              stat: "NFC + QR"
            },
            {
              title: "Reseñas Instantáneas",
              description: "Los clientes pueden dejar reseñas de 5 estrellas con solo acercar su teléfono",
              icon: StarIcon,
              stat: "< 5 segundos"
            },
            {
              title: "Construcción Premium",
              description: "Materiales resistentes y diseño elegante que se adapta a cualquier negocio",
              icon: ShieldCheckIcon,
              stat: "Resistente"
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="flex justify-center mb-4">
                <feature.icon className="w-12 h-12 text-[#7f6d2a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="text-lg font-semibold text-[#7f6d2a]">{feature.stat}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Indícanos el nombre de tu negocio y su código postal y nosotros nos encargamos del resto</h3>
              
              {/* Color Selection */}
              <p className="text-gray-600 mb-3">Tenemos el expositor en blanco y negro. Elije el tuyo:</p>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => handleColorChange('white')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedColor === 'white'
                      ? 'bg-white text-[#7f6d2a] shadow-lg border-2 border-[#7f6d2a]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  Blanco
                </button>
                <button
                  onClick={() => handleColorChange('black')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedColor === 'black'
                      ? 'bg-gray-900 text-white shadow-lg border-2 border-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  Negro
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden relative aspect-square">
                <Image
                  src={images[currentImageIndex].src}
                  alt={images[currentImageIndex].alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              {/* Indicator Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-[#7f6d2a]' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 