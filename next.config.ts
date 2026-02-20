import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow next/image to load Supabase Storage URLs
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
