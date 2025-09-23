
import Image from "next/image";
import bolsaManiaLogo from "./bolsa_mania_logo (1).png";
import europaPressLogo from "./europa_press_logo (1).png";
import merca2Logo from "./merca2_logo (1).png";

export default function FeaturedIn() {
  const logos = [
    {
      src: bolsaManiaLogo,
      alt: "Bolsa Mania",
      name: "Bolsa Mania",
      url: "https://www.bolsamania.com/nota-de-prensa_amp/empresas/just5stars-supera-los-10000-negocios-ayudados-a-mejorar-su-reputacion-online--19130706.html"
    },
    {
      src: europaPressLogo,
      alt: "Europa Press",
      name: "Europa Press",
      url: "https://www.europapress.es/comunicados/empresas-00908/noticia-comunicado-just5stars-supera-10000-negocios-ayudados-mejorar-reputacion-online-20250311154119.html"
    },
    {
      src: merca2Logo,
      alt: "Merca2",
      name: "Merca2",
      url: "https://www.merca2.es/2025/03/11/just5stars-supera-los-10-000-negocios-ayudados-a-mejorar-su-reputacion-online-2160456/"
    }
  ];
// Temporarily disabled featured in section
  return null;

  /*
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Aparecemos en</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex justify-center items-center opacity-60 hover:opacity-100 transition-opacity">
              <a href={logo.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all cursor-pointer"
                  priority={index < 3}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  */
}
