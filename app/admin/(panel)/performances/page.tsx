import { adminPath } from "@/lib/admin-path";
import {
  AdminBoardListClient,
  type AdminBoardColumnDef,
  type AdminBoardRow,
} from "@/components/admin/AdminBoardListClient";
import { createServiceClient } from "@/lib/supabase/admin";

const COLUMNS: AdminBoardColumnDef[] = [
  { key: "title", header: "제목", link: true },
  { key: "year", header: "연도", width: "5rem", align: "center" },
  { key: "home", header: "홈", width: "4rem", align: "center" },
  { key: "published", header: "게시", width: "5rem", align: "center" },
];

export default async function AdminPerformancesPage() {
  let items: AdminBoardRow[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("performances")
      .select("id, title, year, show_on_home, is_published")
      .order("sort_order");
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      href: `/admin/performances/${row.id}`,
      searchText: `${row.title ?? ""} ${row.year ?? ""}`,
      published: Boolean(row.is_published),
      cells: {
        title: String(row.title ?? ""),
        year: String(row.year || "-"),
        home: row.show_on_home ? "Y" : "-",
        published: row.is_published ? "게시" : "비게시",
      },
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <AdminBoardListClient
      title="공연 활동"
      description="홈 최근공연 노출은 ‘홈’ 열에서 확인합니다."
      noun="공연"
      items={items}
      loadError={loadError}
      registerHref={adminPath("/performances/new")}
      searchPlaceholder="제목·연도"
      columns={COLUMNS}
    />
  );
}
