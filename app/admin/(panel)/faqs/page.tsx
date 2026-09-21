import { adminPath } from "@/lib/admin-path";
import {
  AdminBoardListClient,
  type AdminBoardColumnDef,
  type AdminBoardRow,
} from "@/components/admin/AdminBoardListClient";
import { createServiceClient } from "@/lib/supabase/admin";

const COLUMNS: AdminBoardColumnDef[] = [
  { key: "question", header: "질문", link: true },
  { key: "published", header: "게시", width: "5rem", align: "center" },
];

export default async function AdminFaqsPage() {
  let items: AdminBoardRow[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("faqs")
      .select("id, question, is_published")
      .order("sort_order");
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      href: `/admin/faqs/${row.id}`,
      searchText: String(row.question ?? ""),
      published: Boolean(row.is_published),
      cells: {
        question: String(row.question ?? ""),
        published: row.is_published ? "게시" : "비게시",
      },
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <AdminBoardListClient
      title="FAQ"
      noun="FAQ"
      items={items}
      loadError={loadError}
      registerHref={adminPath("/faqs/new")}
      searchPlaceholder="질문"
      columns={COLUMNS}
    />
  );
}
