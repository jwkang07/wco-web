import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

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

// 소스맵 업로드는 SENTRY_AUTH_TOKEN/ORG/PROJECT 가 있을 때만 (없으면 업로드 생략)
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  telemetry: false,
});
