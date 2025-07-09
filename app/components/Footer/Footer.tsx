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
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
              Contáctanos
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Just5Stars. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 