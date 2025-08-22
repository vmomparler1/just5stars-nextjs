import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LastUpdatedDate from '../components/LastUpdatedDate';

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">

              <h1 className="text-4xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>

              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  En todo el sitio web, los términos “nosotros”, “nos” y “nuestro” se refieren a
                  <strong> Just5Stars</strong>. Just5Stars ofrece este sitio web —incluida toda la
                  información, herramientas y servicios disponibles— para ti, el usuario, sujeto a tu
                  aceptación de todos los términos, condiciones, políticas y avisos establecidos en este
                  documento.
                </p>

                <p className="mb-6">
                  Al navegar por nuestro sitio y/o realizar una compra, participas en nuestro “Servicio” y
                  aceptas cumplir con los siguientes términos y condiciones (“Términos de Servicio”,
                  “Términos”). Estos incluyen cualquier término, condición y política adicional mencionados
                  aquí o disponibles mediante hipervínculo. Estos Términos de Servicio se aplican a todos
                  los usuarios del sitio, incluidos, entre otros, navegadores, proveedores, clientes,
                  comerciantes y/o contribuidores de contenido.
                </p>

                <p className="mb-8">
                  Te recomendamos leer estos Términos de Servicio cuidadosamente antes de utilizar el sitio
                  web. Al acceder o utilizar cualquier parte del sitio, indicas tu acuerdo con estos
                  Términos. Si no estás de acuerdo con algún aspecto, debes abstenerte de acceder al sitio o
                  utilizar los Servicios.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 1 - TÉRMINOS DE LA TIENDA ONLINE
                </h2>
                <p className="mb-6">
                  Al aceptar estos Términos de Servicio, confirmas que tienes mayoría de edad en tu país de
                  residencia o que cuentas con autorización de tu tutor legal si eres menor de edad. Está
                  prohibido usar nuestros productos para actividades ilícitas o no autorizadas. Al emplear
                  el Servicio, no debes infringir ninguna ley aplicable (incluyendo derechos de autor). Está
                  estrictamente prohibido transmitir virus, gusanos o cualquier código malicioso. El
                  incumplimiento de cualquiera de estos términos conllevará la suspensión inmediata de tus
                  Servicios.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 2 - CONDICIONES GENERALES
                </h2>
                <p className="mb-6">
                  Nos reservamos el derecho de rechazar el Servicio a cualquier persona, en cualquier
                  momento y por cualquier razón. Aunque tu contenido (excluyendo datos de tarjeta) puede ser
                  transferido sin cifrado e implicar transmisiones a través de diversas redes o ajustes
                  técnicos, los datos de tu tarjeta de crédito se cifran durante la transferencia. Sin
                  nuestro consentimiento por escrito, está prohibido reproducir, duplicar, copiar, vender o
                  explotar cualquier parte del Servicio.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 3 - VALIDEZ Y CONFIABILIDAD DE LA INFORMACIÓN
                </h2>
                <p className="mb-6">
                  Just5Stars no garantiza la exactitud, integridad o actualidad de la información presentada
                  en este sitio. El contenido tiene fines informativos generales y no debe ser la única
                  base para tomar decisiones. Te recomendamos contrastar con otras fuentes fiables. Tu
                  dependencia de la información aquí proporcionada es bajo tu propio riesgo.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 4 - ACTUALIZACIONES DE SERVICIOS Y PRECIOS
                </h2>
                <p className="mb-6">
                  Nuestros precios pueden cambiar sin previo aviso. Podemos modificar o interrumpir el
                  Servicio (o cualquier parte del mismo) en cualquier momento, y no seremos responsables por
                  dichas modificaciones, cambios de precio o interrupciones. Los Servicios incluyen, a modo
                  enunciativo, venta de expositores NFC/QR, consultoría de SEO Local, creación de sitios web
                  sencillos y gestión/soporte asociado.
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    <strong>Expositores:</strong> pago único (<em>one-off</em>).
                  </li>
                  <li>
                    <strong>Consultoría SEO Local</strong> y <strong>Servicio Completo</strong>: pueden
                    ofrecerse en modalidad de suscripción mensual (sin permanencia, salvo indicación
                    expresa). La baja surte efecto al final del ciclo facturado en curso.
                  </li>
                  <li>
                    Los precios se muestran sin impuestos incluidos salvo que se indique lo contrario.
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 5 - PRODUCTOS Y SERVICIOS
                </h2>
                <p className="mb-4">
                  Algunos artículos o servicios pueden estar disponibles solo en línea, con stock limitado,
                  y solo podrán devolverse conforme a nuestra política de devoluciones. Procuramos mostrar
                  los productos con precisión; sin embargo, las pantallas pueden alterar la percepción de
                  color. Podremos limitar ventas por usuario, región o pedido y cambiar descripciones sin
                  aviso.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">5.1 Expositores NFC/QR</h3>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    Incluye el/los soporte(s) físico(s) y la vinculación básica del NFC/QR a la URL de
                    reseñas que nos facilites.
                  </li>
                  <li>No incluye gestión de tu ficha ni campañas de captación de reseñas.</li>
                  <li>
                    <strong>Devoluciones:</strong> admitidas dentro de 30 días desde la entrega, en su
                    estado original y con embalaje, salvo indicación distinta en el sitio.
                  </li>
                  <li>
                    <strong>Envío:</strong> a la dirección indicada por el cliente; los plazos son
                    estimados y pueden variar por causas logísticas o fuerza mayor.
                  </li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                  5.2 Consultoría de SEO Local (Google Maps)
                </h3>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    Auditoría del perfil y recomendaciones priorizadas (categorías, contenidos locales,
                    citaciones, reseñas y respuestas, etc.).
                  </li>
                  <li>
                    <strong>Limitación:</strong> no garantizamos posiciones concretas (p. ej. “Top 3”),
                    pues dependen de competencia, ubicación, algoritmo y políticas de terceros.
                  </li>
                  <li>
                    Si actúas como consumidor, podrás desistir en 14 días desde la contratación siempre que
                    el servicio no haya comenzado o no se haya completado con tu consentimiento expreso.
                  </li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                  5.3 Servicio Completo (SEO Local + web sencilla)
                </h3>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    Sitio básico (one-page o pocas secciones), con ajustes SEO esenciales y contenidos
                    suministrados por el cliente.
                  </li>
                  <li>
                    Excluye desarrollos a medida complejos, e-commerce, multilenguaje avanzado, copywriting
                    profesional o fotografía, salvo pacto expreso.
                  </li>
                  <li>
                    <strong>Propiedad y licencias:</strong> te otorgamos licencia de uso no exclusiva de
                    plantillas y configuración mientras la suscripción esté activa. A la baja, podrás
                    solicitar exportación razonable de tus contenidos (textos, imágenes) no sujetos a
                    licencias de terceros.
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 6 - DETALLES DE PEDIDOS Y CUENTAS
                </h2>
                <p className="mb-4">
                  Podemos rechazar pedidos y limitar o cancelar cantidades por razones operativas o de
                  seguridad. Si se realizan cambios, intentaremos notificarte usando los datos
                  proporcionados. Mantén actualizados tus datos de cuenta, facturación y pago.
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    En suscripciones, autorizas cargos periódicos en el medio de pago indicado; los impagos
                    pueden implicar suspensión hasta regularización.
                  </li>
                  <li>
                    Facturamos con los datos que nos facilites; eres responsable de su veracidad y
                    actualización.
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 7 - HERRAMIENTAS QUE PODEMOS OFRECER
                </h2>
                <p className="mb-6">
                  Podemos darte acceso a herramientas de terceros que no controlamos ni supervisamos. Las
                  utilizas bajo tu propio riesgo y sujeto a las condiciones de sus titulares. Las nuevas
                  funciones o servicios que incorporemos también se regirán por estos Términos.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 8 - ENLACES A OTROS SITIOS</h2>
                <p className="mb-6">
                  El sitio puede contener enlaces a webs de terceros. No somos responsables del contenido ni
                  de los productos/servicios de terceros. Cualquier reclamación debe dirigirse al tercero
                  correspondiente.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 9 - TUS COMENTARIOS</h2>
                <p className="mb-6">
                  Si nos envías ideas o comentarios, podremos usarlos sin obligación de compensarte o
                  mantenerlos confidenciales. Garantizas que tus aportaciones respetan derechos de terceros
                  y no contienen información falsa o ilícita. Eres responsable de lo que publicas.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 10 - TU PRIVACIDAD</h2>
                <p className="mb-6">
                  Protegemos tu información personal conforme a nuestra Política de Privacidad. Para
                  consultas sobre datos personales, escríbenos a{" "}
                  <a href="mailto:info@just5stars.com" className="text-[#7f6d2a] hover:underline">
                    info@just5stars.com
                  </a>
                  .
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 11 - ERRORES EN NUESTRO SITIO</h2>
                <p className="mb-6">
                  Puede haber errores tipográficos, inexactitudes u omisiones relacionadas con descripciones
                  de productos, precios, promociones, disponibilidad y/o tiempos de entrega. Nos reservamos
                  el derecho de corregirlos y de actualizar información sin previo aviso.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 12 - USOS PROHIBIDOS</h2>
                <p className="mb-4">
                  Además de otras prohibiciones, se prohíbe usar el sitio o su contenido para:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Fines ilegales o para solicitar a otros que realicen actos ilícitos.</li>
                  <li>Infringir normativas, derechos de propiedad intelectual o de privacidad.</li>
                  <li>Transmitir malware o interferir con la seguridad y disponibilidad del servicio.</li>
                  <li>
                    Manipular reseñas o incentivar reseñas pagadas/condicionadas en plataformas de terceros
                    (p. ej., Google), contraviniendo sus políticas.
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 13 - LIMITACIÓN DE RESPONSABILIDAD
                </h2>
                <p className="mb-6">
                  Hacemos esfuerzos razonables para prestar nuestros servicios con diligencia profesional,
                  pero no prometemos resultados específicos (p. ej., posiciones en Google). En la máxima
                  medida que permita la ley, nuestra responsabilidad total por reclamaciones derivadas de los
                  Servicios se limita a las cantidades efectivamente pagadas en los 12 meses previos al
                  evento que dio origen a la reclamación. No respondemos por pérdidas indirectas, lucro
                  cesante, decisiones de terceros, cambios de algoritmos o caídas de servicios de terceros.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 14 - INDEMNIZACIÓN</h2>
                <p className="mb-6">
                  Aceptas indemnizar y mantener indemne a Just5Stars frente a reclamaciones de terceros
                  derivadas de tu incumplimiento de estos Términos o de la ley, o de la infracción de
                  derechos de terceros.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 15 - DIVISIBILIDAD</h2>
                <p className="mb-6">
                  Si alguna disposición de estos Términos se considera ilegal, nula o inaplicable, dicha
                  disposición será aplicable en la medida permitida y la parte no aplicable se considerará
                  separada, sin afectar a la validez del resto.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 16 - TERMINACIÓN</h2>
                <p className="mb-6">
                  Cualquiera de las partes puede dar por terminado el acuerdo en cualquier momento.
                  Las obligaciones y responsabilidades contraídas con anterioridad a la terminación
                  subsistirán a todos los efectos.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 17 - ACUERDO COMPLETO</h2>
                <p className="mb-6">
                  Estos Términos, junto con cualquier política o regla operativa publicada por nosotros en
                  el sitio, constituyen el acuerdo íntegro entre tú y Just5Stars, y rigen el uso del
                  Servicio, sustituyendo cualquier acuerdo previo.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  SECCIÓN 18 - LEY ESPAÑOLA APLICABLE
                </h2>
                <p className="mb-6">
                  Estos Términos se rigen por las leyes de España. Salvo que una norma imperativa disponga
                  lo contrario, las partes se someten a los Juzgados y Tribunales de Madrid (España).
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 19 - MANTENTE ACTUALIZADO</h2>
                <p className="mb-6">
                  Revisaremos ocasionalmente estos Términos. Al continuar usando el Servicio tras cualquier
                  cambio, aceptas la versión vigente en ese momento.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">SECCIÓN 20 - CONTACTO</h2>
                <p className="mb-6">
                  ¿Tienes preguntas sobre estos Términos? Escríbenos a{" "}
                  <a href="mailto:info@just5stars.com" className="text-[#7f6d2a] hover:underline">
                    info@just5stars.com
                  </a>
                  .
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