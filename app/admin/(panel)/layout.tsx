import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminSession();
  return <AdminShell adminUsername={session.username}>{children}</AdminShell>;
}
