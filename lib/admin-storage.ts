import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

export async function uploadAdminImage(opts: {
  bucket: "heroes" | "performances" | "musicians";
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

export function resolveMediaUrl(path: string | null | undefined) {
  return getSupabasePublicUrl(path);
}
