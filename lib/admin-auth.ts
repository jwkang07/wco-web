export const ADMIN_COOKIE_NAME = "wco_admin_session";
export const ADMIN_SESSION_HOURS = 12;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    ""
  );
}

export function isAdminPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export function getConfiguredAdminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim() ?? "";
  if (!expected) return false;
  return timingSafeEqualString(password, expected);
}

export function verifyAdminUsername(username: string) {
  const expected = process.env.ADMIN_USERNAME?.trim();
  if (!expected) return true;
  return timingSafeEqualString(username.trim(), expected);
}

function toBase64Url(buffer: ArrayBuffer | Uint8Array) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function utf8ToBase64Url(text: string) {
  return toBase64Url(new TextEncoder().encode(text));
}

function base64UrlToUtf8(encoded: string) {
  const padded =
    encoded.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (encoded.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function hmacSign(payload: string, secret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(signature);
}

export async function createAdminSessionToken(username: string) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET 또는 ADMIN_PASSWORD 가 필요합니다.");
  }
  const exp = Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  const userPart = utf8ToBase64Url(username.trim() || getConfiguredAdminUsername());
  const payload = `v2.${exp}.${userPart}`;
  const sig = await hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

export type AdminSession = { username: string };

export async function readAdminSession(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length === 4 && parts[0] === "v2") {
    const [version, expRaw, userPart, sig] = parts;
    const exp = Number(expRaw);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    const payload = `${version}.${expRaw}.${userPart}`;
    const expected = await hmacSign(payload, secret);
    if (!timingSafeEqualString(sig, expected)) return null;
    try {
      const username = base64UrlToUtf8(userPart).trim();
      if (!username) return null;
      return { username };
    } catch {
      return null;
    }
  }
  return null;
}

export function getAdminCookieOptions(maxAgeSec = ADMIN_SESSION_HOURS * 60 * 60) {
  const secure = process.env.NODE_ENV === "production";
  const base =
    process.env.NEXT_PUBLIC_ADMIN_BASE_PATH?.trim() ||
    process.env.ADMIN_BASE_PATH?.trim() ||
    "/wco-console";
  const path = base.startsWith("/") ? base.replace(/\/+$/g, "") || "/wco-console" : `/${base}`;
  return {
    httpOnly: true,
    secure,
    sameSite: "strict" as const,
    path,
    maxAge: maxAgeSec,
  };
}
