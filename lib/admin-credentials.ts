/**
 * 관리자 로그인 검증 — 추후 DB(admins) 인증으로 교체할 seam.
 *
 * 1차: ADMIN_USERNAME / ADMIN_PASSWORD 환경변수
 * 이후: password_hash 조회·검증으로 이 함수 본문만 교체하면 됨.
 */

import {
  getConfiguredAdminUsername,
  isAdminPasswordConfigured,
  verifyAdminPassword,
  verifyAdminUsername,
} from "@/lib/admin-auth";

export type AdminAuthResult =
  | { ok: true; username: string }
  | { ok: false; error: string };

/** 로컬·1차 운영용 로그인 폼 기본값 (DB 전환 시 제거 가능) */
export const ADMIN_LOGIN_DEFAULTS = {
  username: "admin",
  password: "admin123!",
} as const;

export async function authenticateAdmin(
  username: string,
  password: string,
): Promise<AdminAuthResult> {
  if (!isAdminPasswordConfigured()) {
    return { ok: false, error: "ADMIN_PASSWORD 환경 변수가 없습니다." };
  }

  const user = username.trim();
  if (!verifyAdminUsername(user) || !verifyAdminPassword(password)) {
    return { ok: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  return {
    ok: true,
    username: user || getConfiguredAdminUsername(),
  };
}
