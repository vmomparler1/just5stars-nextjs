export default function FeaturedIn() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Featured In</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {[
            "TechCrunch", "Forbes", "Wall Street Journal", "Bloomberg", "Reuters", "CNN"
          ].map((company) => (
            <div key={company} className="text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-400">{company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 