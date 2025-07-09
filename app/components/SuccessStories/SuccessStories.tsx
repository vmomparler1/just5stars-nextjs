import { StarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import testimonial1 from "./stand_google_testimonial_1.jpg";
import testimonial2 from "./stand_google_testimonial_2.jpg";

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
        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {[
              {
                name: "Sarah Chen",
                role: "CEO, TechStart Inc.",
                content: "Just5Stars transformó completamente nuestro negocio. Pasamos de 3.2 estrellas a calificaciones consistentes de 5 estrellas en solo 3 meses. ¡Los ingresos aumentaron un 340%!",
                image: testimonial1,
                rating: 5,
                growth: "+340% Ingresos",
                isPhoto: true
              },
              {
                name: "Miguel Rodríguez",
                role: "Fundador, Local Eats",
                content: "El sistema de gestión de reseñas es increíble. Ahora respondemos a cada reseña instantáneamente y nuestra satisfacción del cliente nunca ha sido mayor.",
                image: testimonial2,
                rating: 5,
                growth: "+250% Reseñas",
                isPhoto: true
              }
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {story.isPhoto ? (
                  <div className="relative" style={{ height: '35.2rem' }}>
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ height: '38rem' }}>
                    <div className="text-8xl">{story.image}</div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-[#fec700] fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic text-lg">"{story.content}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{story.name}</h4>
                      <p className="text-sm text-gray-600">{story.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{story.growth}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 