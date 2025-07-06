import { ChevronRightIcon, StarIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-50 rounded-full text-[#7f6d2a] text-sm font-medium">
              <StarIcon className="w-4 h-4 mr-2" />
              Trusted by 10,000+ businesses
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Achieve
              <span className="bg-gradient-to-r from-[#7f6d2a] to-[#fec700] bg-clip-text text-transparent"> 5-Star </span>
              Excellence
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Transform your business with our proven system that consistently delivers 5-star results. 
              Join thousands of companies who've revolutionized their success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#7f6d2a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#6a5a23] transition-all transform hover:scale-105 flex items-center justify-center">
                Start Your Journey
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f6d2a] to-[#fec700] rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Performance Boost</h3>
                      <p className="text-sm text-gray-600">+245% increase</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-[#fec700] fill-current" />
                    ))}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-[#7f6d2a] to-[#fec700] rounded-full" style={{width: '85%'}}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">5★</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 