"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function CTA() {
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
    <section className="py-20 bg-gradient-to-r from-[#7f6d2a] to-[#fec700]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">¿Listo para Alcanzar la Excelencia de 5 Estrellas?</h2>
        <p className="text-xl text-amber-100 mb-8">
          Únete a miles de empresas que han transformado su historia de éxito con just5stars
        </p>
        <button 
          onClick={scrollToProducts}
          className="bg-white text-[#7f6d2a] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
        >
          Descubre nuestros servicios
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </section>
  );
} 