import { StarIcon } from "@heroicons/react/24/outline";

export default function SuccessStories() {
  return (
    <section id="stories" className="py-32 bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real businesses that transformed their success with Just5Stars
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "CEO, TechStart Inc.",
              content: "Just5Stars transformed our business completely. We went from 3.2 stars to consistent 5-star ratings in just 3 months. Revenue increased by 340%!",
              image: "👩‍💼",
              rating: 5,
              growth: "+340% Revenue"
            },
            {
              name: "Mike Rodriguez",
              role: "Founder, Local Eats",
              content: "The review management system is incredible. We now respond to every review instantly and our customer satisfaction has never been higher.",
              image: "👨‍🍳",
              rating: 5,
              growth: "+250% Reviews"
            },
            {
              name: "Jennifer Walsh",
              role: "Director, HealthCare Plus",
              content: "The analytics provided insights we never had before. We identified key areas for improvement and our patient satisfaction scores soared.",
              image: "👩‍⚕️",
              rating: 5,
              growth: "+180% Satisfaction"
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