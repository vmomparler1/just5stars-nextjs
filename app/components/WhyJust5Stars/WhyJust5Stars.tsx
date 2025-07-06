export default function WhyJust5Stars() {
  return (
    <section id="why" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Just5Stars?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're not just another service provider. We're your partner in achieving unprecedented success.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Proven Results",
              description: "Our clients consistently achieve 5-star ratings and exceptional growth",
              icon: "🏆",
              stat: "98% Success Rate"
            },
            {
              title: "Expert Team",
              description: "Industry veterans with decades of combined experience",
              icon: "👥",
              stat: "50+ Experts"
            },
            {
              title: "24/7 Support",
              description: "Round-the-clock assistance whenever you need it",
              icon: "🔧",
              stat: "< 1hr Response"
            },
            {
              title: "Cutting-Edge Tech",
              description: "Latest technology and AI-powered solutions",
              icon: "🤖",
              stat: "AI-Powered"
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