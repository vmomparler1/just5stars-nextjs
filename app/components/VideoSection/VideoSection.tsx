
"use client";

export default function VideoSection() {
  return (
    <section className="w-full">
      <div className="text-center">
        <h3 className="text-4xl font-bold mb-4">Te mandamos el expositor ya configurado</h3>
      </div>
      <div className="relative w-full h-[60vh] overflow-hidden">

        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/video/example_find_business.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Optional overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black/20"></div>
        

      </div>
    </section>
  );
}
