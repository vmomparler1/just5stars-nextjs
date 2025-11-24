import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UTMTracker from "./components/UTMTracker";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expositor Reseñas Google NFC & QR - just5stars",
  description: "Expositor de reseñas de Google con NFC y QR. Acerca el móvil y abre tu perfil en 5 s. Envío rápido, sin suscripciones. Blanco o negro.",
  openGraph: {
    title: "Expositor Reseñas Google NFC & QR - just5stars",
    description: "Expositor de reseñas de Google con NFC y QR. Acerca el móvil y abre tu perfil en 5 s. Envío rápido, sin suscripciones. Blanco o negro.",
    images: [
      {
        url: "/images/just5stars_stands.jpg",
        width: 1200,
        height: 630,
        alt: "just5stars Google Review Stands",
      },
    ],
  },
  alternates: {
    canonical: "https://just5stars.com/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <GoogleAnalytics />
        <UTMTracker />
        {children}
      </body>
    </html>
  );
}
