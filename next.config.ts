import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/es',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
