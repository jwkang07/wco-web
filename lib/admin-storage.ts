import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

const ADMIN_IMAGE_BUCKETS = ["heroes", "performances", "musicians"] as const;
type AdminImageBucket = (typeof ADMIN_IMAGE_BUCKETS)[number];

export async function uploadAdminImage(opts: {
  bucket: AdminImageBucket;
  file: File;
  prefix: string;
}) {
  const sb = createServiceClient();
  const ext = opts.file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const key = `${opts.prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const buffer = Buffer.from(await opts.file.arrayBuffer());
  const { error } = await sb.storage.from(opts.bucket).upload(key, buffer, {
    contentType: opts.file.type || `image/${safeExt}`,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return `${opts.bucket}/${key}`;
}

/** Storage에 올린 CMS 이미지만 삭제. `/images/...` 정적 경로·외부 URL은 무시. */
export async function removeAdminImage(path: string | null | undefined) {
  const raw = String(path ?? "").trim();
  if (!raw || raw.startsWith("/") || /^https?:\/\//i.test(raw)) return;

  const slash = raw.indexOf("/");
  if (slash <= 0) return;
  const bucket = raw.slice(0, slash);
  const key = raw.slice(slash + 1);
  if (
    !ADMIN_IMAGE_BUCKETS.includes(bucket as AdminImageBucket) ||
    !key
  ) {
    return;
  }

  const sb = createServiceClient();
  const { error } = await sb.storage.from(bucket).remove([key]);
  if (error) {
    // 이미 없거나 권한 이슈여도 행 삭제는 막지 않음
    console.warn("[removeAdminImage]", raw, error.message);
  }
}

export function resolveMediaUrl(path: string | null | undefined) {
  return getSupabasePublicUrl(path);
}
