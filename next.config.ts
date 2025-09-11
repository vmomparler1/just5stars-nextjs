import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure server for Replit environment
  serverExternalPackages: [],
  async redirects() {
    return [
      {
        source: '/es',
        destination: '/',
        permanent: true,
      },
      {
        source: '/es/products/:path*',
        destination: '/expositor-resenas-nfc',
        permanent: true,
      },
      {
        source: '/stand-google',
        destination: '/expositor-resenas-nfc',
        permanent: true,
      },
      {
        source: '/herramientas/enlace-resenas-google',
        destination: '/',
        permanent: true,
      },
      {
        source: '/herramientas/enlace-resenas',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
