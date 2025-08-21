import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Local Posicionamiento Mapas | just5stars",
  description: "Servicio de SEO Local para mejorar el posicionamiento en Google Maps. Optimización de Google My Business, gestión de reseñas y posicionamiento local.",
};

export default function SEOLocalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 