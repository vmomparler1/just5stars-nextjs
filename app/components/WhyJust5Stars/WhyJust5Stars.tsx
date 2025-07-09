export default function WhyJust5Stars() {
  return (
    <section id="why" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por Qué Elegir Just5Stars?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No somos solo otro proveedor de servicios. Somos tu socio para lograr un éxito sin precedentes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Resultados Probados",
              description: "Nuestros clientes logran consistentemente calificaciones de 5 estrellas y crecimiento excepcional",
              icon: "🏆",
              stat: "98% Tasa de Éxito"
            },
            {
              title: "Equipo Experto",
              description: "Veteranos de la industria con décadas de experiencia combinada",
              icon: "👥",
              stat: "50+ Expertos"
            },
            {
              title: "Soporte 24/7",
              description: "Asistencia las 24 horas cuando lo necesites",
              icon: "🔧",
              stat: "< 1hr Respuesta"
            },
            {
              title: "Tecnología Avanzada",
              description: "Tecnología de última generación y soluciones potenciadas por IA",
              icon: "🤖",
              stat: "Potenciado por IA"
            }
          ].map((item, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="text-lg font-semibold text-[#7f6d2a]">{item.stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 