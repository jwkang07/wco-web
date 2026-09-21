import { adminPath } from "@/lib/admin-path";
import {
  AdminBoardListClient,
  type AdminBoardColumnDef,
  type AdminBoardRow,
} from "@/components/admin/AdminBoardListClient";
import { createServiceClient } from "@/lib/supabase/admin";

const COLUMNS: AdminBoardColumnDef[] = [
  { key: "date", header: "날짜", width: "7rem", align: "center" },
  { key: "title", header: "제목", link: true },
  { key: "home", header: "홈", width: "4rem", align: "center" },
  { key: "published", header: "게시", width: "5rem", align: "center" },
];

export default async function AdminPressPage() {
  let items: AdminBoardRow[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("press_articles")
      .select("id, title, source, published_on, show_on_home, is_published")
      .order("published_on", { ascending: false });
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      href: `/admin/press/${row.id}`,
      searchText: `${row.title ?? ""} ${row.source ?? ""}`,
      published: Boolean(row.is_published),
      cells: {
        date: String(row.published_on || "-"),
        title: String(row.title ?? ""),
        home: row.show_on_home ? "Y" : "-",
        published: row.is_published ? "게시" : "비게시",
      },
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <AdminBoardListClient
      title="보도자료"
      description="홈 보도 노출은 ‘홈’ 열에서 확인합니다."
      noun="보도자료"
      items={items}
      loadError={loadError}
      registerHref={adminPath("/press/new")}
      searchPlaceholder="제목·출처"
      columns={COLUMNS}
    />
  );
}
