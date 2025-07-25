import Image from "next/image";
import logo from "./logo_just5stars_black_background.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4">
              <Image
                src={logo}
                alt="Logo Just5Stars"
                width={80}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 max-w-md">
              Impulsa las Reseñas de Tu Negocio con just5stars.
            </p>
          </div>
          <div className="text-center md:text-right">
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-lg">
              Contáctanos
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
            <p>&copy; 2025 just5stars. Todos los derechos reservados.</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a 
                href="/privacy-policy" 
                className="hover:text-white transition-colors"
              >
                Política de Privacidad
              </a>
              <a 
                href="/terms-and-conditions" 
                className="hover:text-white transition-colors"
              >
                Términos y Condiciones
              </a>
              <a 
                href="/politica-de-devoluciones" 
                className="hover:text-white transition-colors"
              >
                Política de Devoluciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 