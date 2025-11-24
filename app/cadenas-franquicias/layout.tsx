import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expositores NFC para Cadenas y Franquicias | just5stars",
  description: "Gestiona todos tus expositores NFC desde un portal centralizado. Controla múltiples ubicaciones y analiza el rendimiento de cada punto de venta.",
};

export default function CadenasFranquiciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
