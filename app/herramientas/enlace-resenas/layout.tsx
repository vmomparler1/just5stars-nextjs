
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enlaces de Reseñas - Herramienta Gratuita | Just5Stars",
  description: "Genera enlaces directos para que tus clientes dejen reseñas en Google de forma rápida y sencilla. Herramienta gratuita para aumentar tus reseñas online.",
  keywords: "enlace reseñas google, generador enlaces google, reseñas google, google reviews, herramienta gratuita",
  openGraph: {
    title: "Enlaces de Reseñas - Herramienta Gratuita",
    description: "Genera enlaces directos para que tus clientes dejen reseñas en Google de forma rápida y sencilla.",
    url: "https://just5stars.com/herramientas/enlace-resenas",
    siteName: "just5stars",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generador de Enlaces de Reseñas de Google - Herramienta Gratuita",
    description: "Genera enlaces directos para que tus clientes dejen reseñas en Google de forma rápida y sencilla.",
  },
  alternates: {
    canonical: "https://just5stars.com/herramientas/enlace-resenas-google",
  },
};

export default function GoogleReviewLinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
