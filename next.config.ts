import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dev(`npm run dev`)는 .next-dev, build/start는 .next — 동시 실행 시 충돌 방지
  distDir: process.env.NEXT_DIST_DIR || ".next",
  allowedDevOrigins: ["*.trycloudflare.com", "*.loca.lt"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
