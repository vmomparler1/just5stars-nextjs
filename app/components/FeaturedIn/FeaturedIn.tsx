import Image from "next/image";
import bolsaManiaLogo from "./bolsa_mania_logo (1).png";
import economiaDigitalLogo from "./economia_digital_logo (1).png";
import europaPressLogo from "./europa_press_logo (1).png";
import merca2Logo from "./merca2_logo (1).png";

export default function FeaturedIn() {
  const logos = [
    {
      src: bolsaManiaLogo,
      alt: "Bolsa Mania",
      name: "Bolsa Mania"
    },
    {
      src: economiaDigitalLogo,
      alt: "Economia Digital", 
      name: "Economia Digital"
    },
    {
      src: europaPressLogo,
      alt: "Europa Press",
      name: "Europa Press"
    },
    {
      src: merca2Logo,
      alt: "Merca2",
      name: "Merca2"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Aparecemos en</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex justify-center items-center opacity-60 hover:opacity-100 transition-opacity">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={60}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 