import { createHash, createHmac } from "crypto";
import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/admin";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

/**
 * Vercel 등 신뢰 프록시 헤더 우선.
 * x-forwarded-for는 체인의 첫 값이 클라이언트로 가정(플랫폼이 붙인 경우).
 * 형식이 아니면 null.
 */
function parseIpCandidate(raw: string | null | undefined): string | null {
  const v = String(raw ?? "").trim();
  if (!v) return null;
  // IPv4 or simple IPv6 (no zone id)
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(v)) return v;
  if (/^[0-9a-fA-F:]+$/.test(v) && v.includes(":")) return v;
  return null;
}

export async function getRequestRateKey(): Promise<string> {
  const h = await headers();
  const candidates = [
    h.get("x-vercel-forwarded-for"),
    h.get("x-real-ip"),
    // 플랫폼이 붙인 체인이면 왼쪽(원 클라이언트) 사용
    h.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ];
  for (const c of candidates) {
    const ip = parseIpCandidate(c);
    if (ip) return hashRateIdentity(ip);
  }
  return hashRateIdentity("unknown");
}

function hashRateIdentity(ip: string): string {
  const secret =
    process.env.INQUIRY_RATE_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "wco-inquiry-rate-dev";
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}

/**
 * 분산 rate limit (Supabase).
 * 테이블/RPC 미적용·오류 시 **fail-open** → 문의 접수는 계속 가능.
 */
export async function allowInquiryRequest(rateKey: string): Promise<boolean> {
  try {
    const sb = createServiceClient();
    const now = Date.now();
    const bucket = createHash("sha256")
      .update(`${rateKey}:${Math.floor(now / WINDOW_MS)}`)
      .digest("hex")
      .slice(0, 40);

    const { data, error } = await sb.rpc("bump_inquiry_rate", {
      p_bucket: bucket,
      p_limit: MAX_PER_WINDOW,
      p_window_ms: WINDOW_MS,
    });

    if (error) {
      // 마이그레이션 전이면 접수 막지 않음
      console.warn("[inquiry-rate] rpc unavailable, fail-open");
      return true;
    }
    return data === true || data === "t" || Number(data) === 1;
  } catch {
    console.warn("[inquiry-rate] error, fail-open");
    return true;
  }
}
