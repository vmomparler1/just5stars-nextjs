"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ThankYouLocalSEOPromo() {
  return (
    <main>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
              <svg 
                className="w-10 h-10 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¡Gracias!
            </h1>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-left">
              <p className="text-xl text-gray-700 mb-6">
                Gracias por contratar el servicio de SEO Local. Tienes un período de <strong>31 días gratis</strong>.
              </p>

              <p className="text-lg text-gray-600">
                No hay permanencia y puedes darte de baja cuando quieras mandando un correo a{" "}
                <a 
                  href="mailto:info@just5stars.com" 
                  className="text-[#8B7355] hover:text-[#6B5335] font-semibold underline"
                >
                  info@just5stars.com
                </a>
              </p>
            </div>

            <div className="mt-12">
              <a
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#8B7355] text-white font-semibold rounded-lg hover:bg-[#6B5335] transition-colors duration-200"
              >
                Volver a la página principal
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
