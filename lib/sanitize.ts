/**
 * 일반 텍스트 입력 살균 (나무말미 sanitize-input 과 동일 원칙)
 */

const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const ANGLE_BRACKETS_RE = /[<>]/g;
const DANGEROUS_SCHEME_RE = /(?:javascript|vbscript|data)\s*:/gi;

/** null·제어문자·태그 괄호·위험 스킴 제거 */
export function sanitizePlainText(value: string, max = 5000): string {
  return String(value ?? "")
    .replace(/\0/g, "")
    .replace(CONTROL_CHARS_RE, "")
    .replace(ANGLE_BRACKETS_RE, "")
    .replace(DANGEROUS_SCHEME_RE, "")
    .trim()
    .slice(0, Math.max(0, max));
}

/** 한 줄 필드 (제목·이름 등) — 개행을 공백으로 */
export function sanitizePlainLine(value: string, max = 200): string {
  return sanitizePlainText(value, max).replace(/\s+/g, " ").trim();
}

/** 여러 줄 본문 — 개행 유지 */
export function sanitizePlainMultiline(value: string, max = 20000): string {
  return String(value ?? "")
    .replace(/\0/g, "")
    .replace(CONTROL_CHARS_RE, "")
    .replace(ANGLE_BRACKETS_RE, "")
    .replace(DANGEROUS_SCHEME_RE, "")
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, Math.max(0, max));
}

export function looksLikeUnsafeMarkup(value: string): boolean {
  return /<\s*\/?\s*[a-z!]|javascript\s*:|data\s*:text\/html|on\w+\s*=/i.test(
    String(value ?? ""),
  );
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string) {
  return /^[0-9-]{0,15}$/.test(phone);
}

/** 관리자 링크: 비우기·#·상대경로·http(s) */
export function isValidAdminLinkUrl(value: string) {
  const v = value.trim();
  if (!v || v === "#") return true;
  if (v.startsWith("/")) return true;
  return /^https?:\/\//i.test(v);
}

export const ADMIN_IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;
export const ADMIN_IMAGE_MESSAGE =
  "이미지 파일(jpg, jpeg, png, webp)만 등록 가능합니다.";

export function isAllowedAdminImage(file: File) {
  if (ADMIN_IMAGE_ACCEPT.includes(file.type as (typeof ADMIN_IMAGE_ACCEPT)[number])) {
    return true;
  }
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}
