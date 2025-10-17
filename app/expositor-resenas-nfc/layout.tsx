
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expositores NFC para reseñas | just5stars",
  description: "Expositores NFC. Consigue reseñas más fácilmente. Tecnología NFC + QR, configurados previamente para tu negocio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExpositorResenasNFCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
