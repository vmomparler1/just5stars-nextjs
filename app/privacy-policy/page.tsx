import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LastUpdatedDate from '../components/LastUpdatedDate';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg mb-6">
                En Just5Stars, nos comprometemos a proteger tu privacidad y los datos personales que compartes con nosotros. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos tu información personal cuando utilizas nuestros servicios.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">1. INFORMACIÓN QUE RECOPILAMOS</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Información que proporcionas directamente:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Nombre del negocio</li>
                <li>Código postal y país</li>
                <li>Información de pago (procesada de forma segura por terceros)</li>
                <li>Cualquier información adicional que proporciones en formularios de contacto</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Información recopilada automáticamente:</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Dirección IP</li>
                <li>Tipo de navegador y versión</li>
                <li>Páginas visitadas en nuestro sitio web</li>
                <li>Tiempo de permanencia en el sitio</li>
                <li>Información del dispositivo (tipo, sistema operativo)</li>
                <li>Cookies y tecnologías similares</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. CÓMO UTILIZAMOS TU INFORMACIÓN</h2>
              <p className="mb-4">Utilizamos tu información personal para:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Procesar tus pedidos y proporcionar nuestros servicios</li>
                <li>Comunicarnos contigo sobre tu pedido o servicios</li>
                <li>Proporcionar soporte técnico y atención al cliente</li>
                <li>Mejorar nuestros servicios y experiencia de usuario</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
                <li>Enviarte información sobre servicios relacionados (solo con tu consentimiento)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. BASE LEGAL PARA EL PROCESAMIENTO</h2>
              <p className="mb-4">Procesamos tu información personal basándose en:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Ejecución de contrato:</strong> Para proporcionar los servicios que has solicitado</li>
                <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes</li>
                <li><strong>Consentimiento:</strong> Para marketing y comunicaciones opcionales</li>
                <li><strong>Cumplimiento legal:</strong> Para cumplir con obligaciones legales</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. COMPARTIR TU INFORMACIÓN</h2>
              <p className="mb-4">No vendemos tu información personal. Podemos compartir tu información con:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Proveedores de servicios:</strong> Para procesar pagos, envío de productos y servicios técnicos</li>
                <li><strong>Autoridades legales:</strong> Cuando sea requerido por ley</li>
                <li><strong>Socios comerciales:</strong> Solo con tu consentimiento explícito</li>
                <li><strong>Google:</strong> Para servicios de Google Maps y Google Business cuando sea necesario</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. COOKIES Y TECNOLOGÍAS SIMILARES</h2>
              <p className="mb-4">Utilizamos cookies para:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Funcionalidad esencial del sitio web</li>
                <li>Análisis de uso del sitio web</li>
                <li>Personalización de experiencia</li>
                <li>Marketing (solo con tu consentimiento)</li>
              </ul>
              <p className="mb-6">
                Puedes controlar las cookies a través de nuestro banner de cookies y la configuración de tu navegador.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. SEGURIDAD DE DATOS</h2>
              <p className="mb-4">Implementamos medidas de seguridad apropiadas para proteger tu información:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Acceso limitado a información personal</li>
                <li>Auditorías regulares de seguridad</li>
                <li>Formación del personal en protección de datos</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. RETENCIÓN DE DATOS</h2>
              <p className="mb-6">
                Conservamos tu información personal solo durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo requisitos legales, contables o de informes. Generalmente, esto es por un período de 7 años después de la finalización de nuestros servicios.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. TUS DERECHOS</h2>
              <p className="mb-4">Bajo la legislación de protección de datos, tienes derecho a:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Acceso:</strong> Solicitar acceso a tus datos personales</li>
                <li><strong>Rectificación:</strong> Solicitar corrección de datos inexactos</li>
                <li><strong>Supresión:</strong> Solicitar eliminación de tus datos</li>
                <li><strong>Limitación:</strong> Solicitar restricción del procesamiento</li>
                <li><strong>Portabilidad:</strong> Solicitar transferencia de datos</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Retirada de consentimiento:</strong> Retirar consentimiento en cualquier momento</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. TRANSFERENCIAS INTERNACIONALES</h2>
              <p className="mb-6">
                Si transferimos tu información personal fuera del Espacio Económico Europeo (EEE), nos aseguraremos de que esté adecuadamente protegida mediante salvaguardias apropiadas, como cláusulas contractuales estándar aprobadas por la Comisión Europea.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. MENORES DE EDAD</h2>
              <p className="mb-6">
                Nuestros servicios no están dirigidos a menores de 16 años. No recopilamos intencionalmente información personal de menores de 16 años sin el consentimiento de los padres.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. CAMBIOS EN ESTA POLÍTICA</h2>
              <p className="mb-6">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos por correo electrónico o mediante un aviso destacado en nuestro sitio web.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12. CONTACTO</h2>
              <p className="mb-4">
                Si tienes preguntas sobre esta Política de Privacidad o quieres ejercer tus derechos, puedes contactarnos:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:info@just5stars.com" className="text-[#7f6d2a] hover:underline">
                    info@just5stars.com
                  </a>
                </li>
                <li><strong>Teléfono:</strong> +34 645 061 155</li>
                <li><strong>Dirección:</strong> España</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">13. AUTORIDAD DE CONTROL</h2>
              <p className="mb-6">
                Si no estás satisfecho con nuestra respuesta a cualquier queja o crees que nuestro procesamiento de tu información personal no cumple con la ley de protección de datos, puedes presentar una queja ante la Agencia Española de Protección de Datos (AEPD).
              </p>

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