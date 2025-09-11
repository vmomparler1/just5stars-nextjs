
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Local Google Maps - Prueba 30 días gratis | just5stars",
  description: "Mejora tu posicionamiento en Google Maps con nuestro servicio SEO Local. Prueba 30 días gratis, sin compromiso.",
  openGraph: {
    title: "SEO Local Google Maps - Prueba 30 días gratis",
    description: "Mejora tu posicionamiento en Google Maps con nuestro servicio SEO Local. Prueba 30 días gratis, sin compromiso.",
    url: "https://just5stars.com/seo-local-promo",
    siteName: "just5stars",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Local Google Maps - Prueba 30 días gratis",
    description: "Mejora tu posicionamiento en Google Maps con nuestro servicio SEO Local. Prueba 30 días gratis, sin compromiso.",
  },
  alternates: {
    canonical: "https://just5stars.com/seo-local-promo",
  },
};

export default function SEOLocalPromoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
