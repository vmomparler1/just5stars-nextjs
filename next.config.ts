import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ]
  },
};

export default nextConfig;
