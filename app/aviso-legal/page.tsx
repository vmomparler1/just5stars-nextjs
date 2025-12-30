import type { Metadata } from "next";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LastUpdatedDate from '../components/LastUpdatedDate';

export const metadata: Metadata = {
  title: "Aviso Legal | just5stars",
  description: "Aviso legal de just5stars. Información identificativa, condiciones de uso y responsabilidades del sitio web.",
};

export default function AvisoLegalPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Aviso Legal</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg mb-6">
                En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE) de 11 de julio, se facilitan a continuación los siguientes datos de información general de este sitio web:
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">1. DATOS IDENTIFICATIVOS</h2>
              <div className="bg-amber-50 p-6 rounded-lg mb-6">
                <p className="mb-2"><strong>Titular del sitio web:</strong> Global Mistral Solutions SL</p>
                <p className="mb-2"><strong>CIF:</strong> 22596541F</p>
                <p className="mb-2"><strong>Domicilio:</strong> C/Travesía s/n, 46024, Valencia</p>
                <p className="mb-2"><strong>Sitio Web:</strong> just5stars.com</p>
                <p className="mb-2"><strong>Correo electrónico:</strong> info@just5stars.com</p>
                <p><strong>Teléfono:</strong> +34 645 061 155</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. OBJETO</h2>
              <p className="mb-6">
                El presente sitio web tiene por objeto facilitar al público en general el conocimiento de los servicios que ofrece Just5Stars, incluyendo expositores NFC para recolección de reseñas, servicios de SEO local y gestión de presencia digital para negocios.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. CONDICIONES DE ACCESO Y USO</h2>
              <p className="mb-4">
                El acceso a este sitio web es responsabilidad exclusiva de los usuarios. El simple acceso a este sitio web no supone entablar una relación comercial entre Just5Stars y el usuario.
              </p>
              <p className="mb-6">
                La utilización de este sitio web y de los servicios ofrecidos en el mismo están sujetos a los presentes términos. El usuario debe leer, entender y aceptar todas las condiciones establecidas en el aviso legal y en la política de privacidad antes de iniciar la navegación por este sitio web.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. RESPONSABILIDADES</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsabilidad del usuario:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Hacer un uso correcto del sitio web y de sus contenidos</li>
                <li>No emplear el sitio web para actividades ilegales o prohibidas</li>
                <li>No dañar, inutilizar o sobrecargar el sitio web</li>
                <li>No introducir virus o códigos maliciosos</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsabilidad del titular:</h3>
              <p className="mb-6">
                El titular del sitio web se compromete a mantener la información actualizada y a facilitar el acceso a los contenidos. Sin embargo, no se responsabiliza de los posibles daños o perjuicios que puedan derivarse de interferencias, interrupciones, virus informáticos, averías telefónicas o desconexiones en el funcionamiento operativo de este sistema electrónico.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. CONTENIDOS</h2>
              <p className="mb-6">
                Los contenidos de este sitio web tienen carácter meramente informativo. Just5Stars se reserva el derecho a modificar en cualquier momento los contenidos existentes en el sitio web, sin necesidad de previo aviso.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
              <p className="mb-6">
                Todos los contenidos de este sitio web (textos, imágenes, sonido, audio, vídeo, diseños, creatividades, software, etc.) están protegidos por los derechos de propiedad intelectual e industrial de Just5Stars o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución, comunicación pública y transformación sin la autorización de los titulares correspondientes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. PROTECCIÓN DE DATOS</h2>
              <p className="mb-6">
                Para conocer información sobre el tratamiento de datos personales, consulte nuestra{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-[#7f6d2a] hover:underline font-medium"
                >
                  Política de Privacidad
                </a>.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. ENLACES</h2>
              <p className="mb-6">
                Este sitio web puede contener enlaces a otros sitios web. Just5Stars no controla dichos sitios web, por lo que no se hace responsable de sus contenidos. El usuario accede a dichos sitios bajo su propia responsabilidad.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. COOKIES</h2>
              <p className="mb-6">
                Este sitio web utiliza cookies para mejorar la experiencia de navegación del usuario. Para más información, consulte nuestro aviso de cookies disponible en el sitio web.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. LEY APLICABLE Y JURISDICCIÓN</h2>
              <p className="mb-6">
                Las presentes condiciones se regirán por la legislación española. Para la resolución de cualquier conflicto que pueda surgir con ocasión de la visita al sitio web o del uso de los servicios que en él se puedan ofertar, serán competentes los Juzgados y Tribunales españoles.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. MODIFICACIONES</h2>
              <p className="mb-6">
                Just5Stars se reserva el derecho de modificar el presente aviso legal para adaptarlo a las novedades legislativas, jurisprudenciales o a la práctica empresarial en cada momento. Dichas modificaciones serán anunciadas con la suficiente antelación antes de su puesta en marcha.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12. CONTACTO</h2>
              <p className="mb-4">
                Para cualquier consulta sobre este aviso legal, puede contactarnos:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:info@just5stars.com" className="text-[#7f6d2a] hover:underline">
                    info@just5stars.com
                  </a>
                </li>
                <li><strong>Teléfono:</strong> +34 645 061 155</li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <LastUpdatedDate />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
