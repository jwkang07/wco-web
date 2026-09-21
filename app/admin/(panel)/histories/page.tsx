import {
  AdminBoardListClient,
  type AdminBoardColumnDef,
  type AdminBoardRow,
} from "@/components/admin/AdminBoardListClient";
import { adminPath } from "@/lib/admin-path";
import { createServiceClient } from "@/lib/supabase/admin";

const COLUMNS: AdminBoardColumnDef[] = [
  { key: "year", header: "연도", width: "5rem", align: "center", link: true },
  { key: "body", header: "내용" },
  { key: "published", header: "게시", width: "5rem", align: "center" },
];

export default async function AdminHistoriesPage() {
  let items: AdminBoardRow[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("histories")
      .select("id, year, body, is_published, sort_order")
      .order("sort_order");
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      href: adminPath(`/histories/${row.id}`),
      searchText: `${row.year ?? ""} ${row.body ?? ""}`,
      published: Boolean(row.is_published),
      cells: {
        year: String(row.year ?? ""),
        body: String(row.body ?? ""),
        published: row.is_published ? "게시" : "비게시",
      },
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <AdminBoardListClient
      title="히스토리"
      noun="히스토리"
      items={items}
      loadError={loadError}
      registerHref={adminPath("/histories/new")}
      searchPlaceholder="연도·내용"
      columns={COLUMNS}
    />
  );
}
