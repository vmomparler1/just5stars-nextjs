
"use client";

export default function VideoSection() {
  return (
    <section className="w-full">
      <div className="relative w-full h-[60vh] overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/video/stand-demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Optional overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Optional content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-4xl font-bold mb-4">Ve nuestros expositores en acción</h3>
            <p className="text-xl max-w-2xl mx-auto">
              Descubre cómo nuestros expositores NFC revolucionan la forma de conseguir reseñas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
