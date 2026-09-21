"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { writeAuditLog } from "@/lib/admin-audit";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  getConfiguredAdminUsername,
} from "@/lib/admin-auth";
import { authenticateAdmin } from "@/lib/admin-credentials";
import { ADMIN_HOME_HREF } from "@/lib/admin-nav";
import { adminPath, isAdminPathname } from "@/lib/admin-path";

export type AdminLoginState = {
  error?: string;
};

export async function adminLoginAction(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? ADMIN_HOME_HREF);

  const auth = await authenticateAdmin(username, password);
  if (!auth.ok) return { error: auth.error };

  const token = await createAdminSessionToken(auth.username);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions());
  await writeAuditLog({
    adminUsername: auth.username,
    action: "login",
    entityType: "session",
    summary: "관리자 로그인",
  });
  redirect(isAdminPathname(next) ? next : ADMIN_HOME_HREF);
}

export async function adminLogoutAction() {
  const jar = await cookies();
  const username = getConfiguredAdminUsername();
  jar.set(ADMIN_COOKIE_NAME, "", { ...getAdminCookieOptions(0), maxAge: 0 });
  await writeAuditLog({
    adminUsername: username,
    action: "logout",
    entityType: "session",
    summary: "관리자 로그아웃",
  });
  redirect(adminPath("/login"));
}
