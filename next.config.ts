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
        destination: '/stand-google',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
