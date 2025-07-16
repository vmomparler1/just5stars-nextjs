import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PoliticaDevolucionesPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Devoluciones</h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg mb-6">
                En Just5Stars, hacemos todo lo posible para asegurar que estés satisfecho con tu compra. Si por alguna razón no estás satisfecho con tu pedido, puedes devolverlo dentro de los 30 días posteriores a la fecha de entrega, siempre que se cumplan las condiciones que se detallan a continuación.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Período de Devolución</h2>
              <p className="mb-6">
                Tienes derecho a devolver tu pedido dentro de los 30 días posteriores a la fecha de entrega. Después de este período lamentablemente no podemos aceptar devoluciones.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Condiciones para las Devoluciones</h2>
              <p className="mb-4">Para ser elegible para una devolución, el producto debe cumplir las siguientes condiciones:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>El producto debe estar en su estado original y no debe haber sido usado o dañado.</li>
                <li>El producto debe ser devuelto en su embalaje original.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Productos que No Pueden Devolverse</h2>
              <p className="mb-4">Los siguientes productos no pueden ser devueltos:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Productos con respaldo adhesivo con la película protectora removida.</li>
                <li>Productos personalizados o hechos especialmente para el cliente.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Procedimiento para Devoluciones</h2>
              <p className="mb-4">Si deseas devolver un producto, por favor sigue estos pasos:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Contacta nuestro servicio de atención al cliente por email o teléfono para solicitar la devolución.</li>
                <li>Asegúrate de que el producto cumple las condiciones de devolución.</li>
                <li>Empaca el producto de forma segura e incluye una copia de la factura o formulario de pedido.</li>
                <li>Envía el paquete a nuestra dirección de devoluciones a través del transportista de tu elección. Ten en cuenta que el cliente es responsable del costo del envío de devolución.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Costo de las Devoluciones</h2>
              <p className="mb-6">
                El costo del envío de devolución es responsabilidad del cliente. Eres libre de elegir tu propio transportista para devolver el producto. Recomendamos que uses un método de envío con seguimiento para que puedas rastrear el estado de la devolución.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Reembolso</h2>
              <p className="mb-6">
                Una vez que hayamos recibido y verificado tu devolución, te notificaremos por correo electrónico sobre el estado de tu reembolso. El reembolso se realizará a través del método de pago original dentro de los 14 días posteriores a la recepción de los productos devueltos.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Intercambios</h2>
              <p className="mb-4">Si deseas intercambiar un producto, puedes devolver el producto deseado según el procedimiento mencionado anteriormente. Los intercambios solo pueden realizarse si:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Los productos devueltos están sin usar y sin daños.</li>
                <li>Los nuevos productos deseados están disponibles.</li>
              </ul>
              <p className="mb-6">
                Si el producto que deseas intercambiar no está disponible, recibirás un reembolso según las condiciones de reembolso.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Contacto</h2>
              <p className="mb-4">
                Para preguntas sobre nuestra política de devoluciones, por favor contáctanos en:
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
                <p className="text-sm text-gray-500">
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 