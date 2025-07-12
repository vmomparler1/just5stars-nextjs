import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UTMTracker from "./components/UTMTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "just5stars - SEO local y marketing digital para pequeños negocios",
  description: "Transforma tu negocio con nuestro sistema probado que ofrece consistentemente resultados de 5 estrellas. Únete a miles de empresas que han revolucionado su historia de éxito.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UTMTracker />
        {children}
      </body>
    </html>
  );
}
