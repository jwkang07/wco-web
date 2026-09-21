import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { ADMIN_HOME_HREF } from "@/lib/admin-nav";
import { isAdminPathname } from "@/lib/admin-path";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next && isAdminPathname(params.next) ? params.next : ADMIN_HOME_HREF;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f7f7f6] px-4">
      <div className="mb-6 text-center">
        <p className="text-lg font-bold">WCO 관리자</p>
        <p className="mt-1 text-sm text-[#6B6B6B]">우리챔버오케스트라</p>
      </div>
      <AdminLoginForm nextPath={nextPath} />
    </div>
  );
}
