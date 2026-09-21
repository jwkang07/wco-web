import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  readAdminSession,
  type AdminSession,
} from "@/lib/admin-auth";
import { adminPath } from "@/lib/admin-path";

export async function requireAdminSession(): Promise<AdminSession> {
  const jar = await cookies();
  const session = await readAdminSession(jar.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) redirect(adminPath("/login"));
  return session;
}
