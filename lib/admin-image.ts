/**
 * 관리자 이미지 업로드 검증.
 * MIME/확장자만 믿지 않고 크기·매직바이트를 확인합니다.
 */

export const ADMIN_IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;
export const ADMIN_IMAGE_MESSAGE =
  "이미지 파일(jpg, jpeg, png, webp)만 등록 가능합니다.";
export const ADMIN_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

const EXT_BY_MIME: Record<string, "jpg" | "png" | "webp"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ValidatedAdminImage = {
  buffer: Buffer;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  ext: "jpg" | "png" | "webp";
};

function sniffImageMime(
  buf: Buffer,
): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buf.length < 12) return null;
  // JPEG FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  // PNG
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  // WEBP: RIFF....WEBP
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

/** 빠른 사전 검사 (size/type) — arrayBuffer 전 */
export function isAllowedAdminImage(file: File) {
  if (file.size <= 0 || file.size > ADMIN_IMAGE_MAX_BYTES) return false;
  if (ADMIN_IMAGE_ACCEPT.includes(file.type as (typeof ADMIN_IMAGE_ACCEPT)[number])) {
    return true;
  }
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

/** 크기·매직바이트까지 검증. 통과 시 서버가 정한 content-type/확장자만 사용. */
export async function validateAdminImageFile(
  file: File,
): Promise<ValidatedAdminImage | { error: string }> {
  if (!(file instanceof File) || file.size <= 0) {
    return { error: ADMIN_IMAGE_MESSAGE };
  }
  if (file.size > ADMIN_IMAGE_MAX_BYTES) {
    return { error: "이미지 용량은 10MB 이하여야 합니다." };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageMime(buffer);
  if (!sniffed) {
    return { error: ADMIN_IMAGE_MESSAGE };
  }
  // 브라우저가 비우거나 octet-stream을 주는 경우가 있어 sniff를 우선.
  // 선언이 허용 MIME인데 sniff와 다를 때만 거부.
  const declared = String(file.type || "").toLowerCase();
  if (
    declared &&
    ADMIN_IMAGE_ACCEPT.includes(
      declared as (typeof ADMIN_IMAGE_ACCEPT)[number],
    ) &&
    declared !== sniffed
  ) {
    return { error: ADMIN_IMAGE_MESSAGE };
  }
  return {
    buffer,
    contentType: sniffed,
    ext: EXT_BY_MIME[sniffed],
  };
}
