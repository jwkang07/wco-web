/**
 * 공개 관리자 URL prefix.
 * 앱 라우트는 `app/admin` 유지, 미들웨어가 공개 경로로 rewrite.
 *
 * 기본: /wco-console
 * 변경: NEXT_PUBLIC_ADMIN_BASE_PATH=/원하는경로
 */
const FALLBACK_ADMIN_BASE = "/wco-console";

function normalizeAdminBase(raw: string | undefined): string {
  let value = (raw ?? "").trim();
  if (!value) value = FALLBACK_ADMIN_BASE;
  if (!value.startsWith("/")) value = `/${value}`;
  value = value.replace(/\/+$/g, "");
  if (!value || value === "/") value = FALLBACK_ADMIN_BASE;
  const blocked = new Set([
    "/api",
    "/_next",
    "/admin",
    "/about",
    "/activities",
    "/musicians",
    "/employment",
    "/contact",
    "/login",
  ]);
  if (blocked.has(value)) value = FALLBACK_ADMIN_BASE;
  return value;
}

/** 브라우저에 보이는 관리자 루트 (예: /wco-console) */
export function getAdminBasePath() {
  return normalizeAdminBase(
    process.env.NEXT_PUBLIC_ADMIN_BASE_PATH ?? process.env.ADMIN_BASE_PATH,
  );
}

/** `/heroes` → `/wco-console/heroes` */
export function adminPath(subPath = ""): string {
  const base = getAdminBasePath();
  if (!subPath || subPath === "/") return base;
  const rest = subPath.startsWith("/") ? subPath : `/${subPath}`;
  if (rest === "/admin" || rest.startsWith("/admin/")) {
    return `${base}${rest.slice("/admin".length) || ""}` || base;
  }
  return `${base}${rest}`;
}

export function isAdminPathname(pathname: string) {
  const base = getAdminBasePath();
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** 공개 관리자 경로 → 내부 `/admin...` (없으면 null) */
export function toInternalAdminPath(pathname: string): string | null {
  const base = getAdminBasePath();
  if (pathname === base || pathname === `${base}/`) return "/admin";
  if (pathname.startsWith(`${base}/`)) {
    return `/admin/${pathname.slice(base.length + 1)}`;
  }
  return null;
}

/** 내부 `/admin...` → 공개 관리자 경로 */
export function toPublicAdminPath(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return getAdminBasePath();
  if (pathname.startsWith("/admin/")) {
    return adminPath(pathname.slice("/admin".length));
  }
  return pathname;
}
