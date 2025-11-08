import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | just5stars",
  description: "Contacta con just5stars para más información sobre nuestros expositores NFC de reseñas Google y servicios de SEO local. Estamos aquí para ayudarte.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
