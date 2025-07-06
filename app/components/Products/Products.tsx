import { CheckIcon } from "@heroicons/react/24/outline";

export default function Products() {
  return (
    <section id="products" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our suite of powerful tools designed to elevate your business to 5-star excellence
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Analytics Pro",
              description: "Advanced analytics and insights to track your performance and optimize results",
              icon: "📊",
              price: "$49/month",
              features: ["Real-time analytics", "Custom dashboards", "AI insights"]
            },
            {
              title: "Review Manager",
              description: "Manage and optimize your online reviews across all platforms",
              icon: "⭐",
              price: "$79/month",
              features: ["Review monitoring", "Response automation", "Sentiment analysis"]
            },
            {
              title: "Success Accelerator",
              description: "Complete solution for businesses seeking rapid growth and 5-star results",
              icon: "🚀",
              price: "$149/month",
              features: ["Full suite access", "Priority support", "Custom training"]
            }
          ].map((product, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{product.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="text-3xl font-bold text-[#7f6d2a] mb-6">{product.price}</div>
              <ul className="space-y-3 mb-8">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-[#7f6d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#6a5a23] transition-colors">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 