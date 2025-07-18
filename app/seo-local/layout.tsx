import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Local Google Maps - Aparece en las Primeras Posiciones | Just5Stars",
  description: "Servicio de SEO Local para aparecer en las primeras posiciones de Google Maps. Optimización de Google My Business, gestión de reseñas y posicionamiento local.",
};

export default function SEOLocalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 