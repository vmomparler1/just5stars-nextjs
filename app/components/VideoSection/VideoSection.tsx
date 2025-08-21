
"use client";

export default function VideoSection() {
  return (
    <section className="w-full pt-6">
      <div className="text-center">
        <h3 className="text-4xl font-bold mb-4 max-w-screen-md mx-auto">Indícanos el nombre de tu negocio y su código postal y nosotros nos encargamos del resto</h3>
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
          <source src="/video/example_find_business_mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/video/example_find_business.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Optional overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black/20"></div>
        

      </div>
    </section>
  );
}
