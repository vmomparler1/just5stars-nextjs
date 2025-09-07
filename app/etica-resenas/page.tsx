
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LastUpdatedDate from '../components/LastUpdatedDate';

export default function EticaResenasPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Ética de Reseñas y Cumplimiento</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Nuestra postura</h2>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-[#7f6d2a] mr-3 mt-1">•</span>
                  <span>Suministramos herramientas NFC/QR que llevan a los clientes a tu perfil público de reseñas.</span>
                </li>
                
                <li className="flex items-start">
                  <span className="text-[#7f6d2a] mr-3 mt-1">•</span>
                  <span>No creamos, compramos, editamos, eliminamos ni incentivamos reseñas.</span>
                </li>
                
                <li className="flex items-start">
                  <span className="text-[#7f6d2a] mr-3 mt-1">•</span>
                  <span>No filtramos clientes por satisfacción (no hacemos "gating").</span>
                </li>
                
                <li className="flex items-start">
                  <span className="text-[#7f6d2a] mr-3 mt-1">•</span>
                  <span>Nunca publicamos reseñas en nombre del cliente ni pedimos credenciales.</span>
                </li>
                
                <li className="flex items-start">
                  <span className="text-[#7f6d2a] mr-3 mt-1">•</span>
                  <span>No estamos afiliados ni avalados por Google u otras plataformas.</span>
                </li>
                
                <li className="flex items-start">
                  <span className="text-[#7f6d2a] mr-3 mt-1">•</span>
                  <span>El uso de nuestros productos debe cumplir las políticas de cada plataforma y la normativa aplicable.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">Última actualización: 7/9/2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
