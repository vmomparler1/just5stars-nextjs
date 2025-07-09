import { ChevronRightIcon, StarIcon, CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import standHeroImage from "./hero_just5.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-50 rounded-full text-[#7f6d2a] text-sm font-medium">
              <StarIcon className="w-4 h-4 mr-2" />
              Más de 10,000 empresas confían en nosotros
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Alcanza la
              <br />
              <span className="bg-gradient-to-r from-[#7f6d2a] to-[#fec700] bg-clip-text text-transparent">Excelencia</span>
              <br />
              de 5 Estrellas
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Ayudamos a pequeños negocios a crecer con nuestros 3 servicios principales:
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-2" />
                  SEO local para destacar en Google Maps
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-2" />
                  Soportes NFC para conseguir más reseñas positivas
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-[#7f6d2a] mr-2" />
                  Gestión 360 para maximizar tu presencia digital
                </li>
              </ul>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#7f6d2a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#6a5a23] transition-all transform hover:scale-105 flex items-center justify-center">
                Descubre nuestros servicios
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f6d2a] to-[#fec700] rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative flex justify-center">
              <Image
                src={standHeroImage}
                alt="Stand de Reseñas de Google Just5Stars"
                width={900}
                height={1000}
                className="w-full h-auto max-w-xl object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 