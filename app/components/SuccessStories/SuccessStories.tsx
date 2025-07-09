import { StarIcon } from "@heroicons/react/24/outline";

export default function SuccessStories() {
  return (
    <section id="stories" className="py-32 bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Casos de Éxito</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Historias reales de empresas reales que transformaron su éxito con Just5Stars
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "CEO, TechStart Inc.",
              content: "Just5Stars transformó completamente nuestro negocio. Pasamos de 3.2 estrellas a calificaciones consistentes de 5 estrellas en solo 3 meses. ¡Los ingresos aumentaron un 340%!",
              image: "👩‍💼",
              rating: 5,
              growth: "+340% Ingresos"
            },
            {
              name: "Miguel Rodríguez",
              role: "Fundador, Local Eats",
              content: "El sistema de gestión de reseñas es increíble. Ahora respondemos a cada reseña instantáneamente y nuestra satisfacción del cliente nunca ha sido mayor.",
              image: "👨‍🍳",
              rating: 5,
              growth: "+250% Reseñas"
            },
            {
              name: "Jennifer Walsh",
              role: "Directora, HealthCare Plus",
              content: "Los análisis proporcionaron información que nunca habíamos tenido antes. Identificamos áreas clave de mejora y nuestras puntuaciones de satisfacción del paciente se dispararon.",
              image: "👩‍⚕️",
              rating: 5,
              growth: "+180% Satisfacción"
            }
          ].map((story, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(story.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-[#fec700] fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{story.content}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{story.image}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{story.growth}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 