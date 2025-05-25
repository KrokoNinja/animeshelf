import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "media.kitsu.app",
      },
      {
        hostname: "kitsu.io",
      }
    ]
  }
};

export default nextConfig;
