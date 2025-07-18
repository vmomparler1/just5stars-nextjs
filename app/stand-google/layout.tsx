import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expositores NFC Google - Consigue más Reseñas de 5 Estrellas | Just5Stars",
  description: "Expositores NFC para conseguir más reseñas de Google. Tecnología NFC + QR, preconfigurados para tu negocio. Aumenta reseñas hasta un 300%.",
};

export default function StandGoogleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 