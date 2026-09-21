import { createClient } from "@supabase/supabase-js";

/** 서버 전용 — RLS 우회. 클라이언트에 import 금지. */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_URL 이 없습니다.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabasePublicUrl(path: string | null | undefined) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return path;
  return `${base}/storage/v1/object/public/${path}`;
}
