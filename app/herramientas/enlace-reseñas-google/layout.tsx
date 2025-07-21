
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generador de Enlaces de Reseñas de Google - Herramienta Gratuita | Just5Stars",
  description: "Genera enlaces directos para que tus clientes dejen reseñas en Google fácilmente. Herramienta gratuita para crear links de reseñas personalizados.",
  keywords: "generador enlaces reseñas google, link reseñas google, herramienta reseñas google, enlace directo reseñas",
  alternates: {
    canonical: "/herramientas/enlace-resenas-google"
  }
};

export default function GoogleReviewLinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
