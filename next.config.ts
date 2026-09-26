import type { NextConfig } from "next";

/** 개발용 Origin — 와일드카드 금지. 쉼표 구분 정확 Origin만. */
function allowedDevOrigins(): string[] | undefined {
  const raw = process.env.ALLOWED_DEV_ORIGINS?.trim();
  if (!raw) return undefined;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

const nextConfig: NextConfig = {
  // dev(`npm run dev`)는 .next-dev, build/start는 .next — 동시 실행 시 충돌 방지
  distDir: process.env.NEXT_DIST_DIR || ".next",
  ...(allowedDevOrigins()
    ? { allowedDevOrigins: allowedDevOrigins() }
    : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wtdvzvlizcvabziihsle.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
