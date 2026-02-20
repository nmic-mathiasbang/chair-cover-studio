import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  // Force-include swatch images in the serverless function bundle so
  // readFile() can access them at runtime on Vercel.
  outputFileTracingIncludes: {
    "/api/generate": ["./public/swatches/**/*"],
  },
};

export default nextConfig;
