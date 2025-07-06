import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#7f6d2a] to-[#fec700]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Achieve 5-Star Excellence?</h2>
        <p className="text-xl text-amber-100 mb-8">
          Join thousands of businesses who've transformed their success story with Just5Stars
        </p>
        <button className="bg-white text-[#7f6d2a] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
          Start Your Free Trial
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </section>
  );
} 