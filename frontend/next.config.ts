import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Turbopack config removed - using defaults */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
