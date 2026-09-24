import { adminPath } from "@/lib/admin-path";
import {
  AdminBoardListClient,
  type AdminBoardColumnDef,
  type AdminBoardRow,
} from "@/components/admin/AdminBoardListClient";
import { createServiceClient } from "@/lib/supabase/admin";

function formatCreatedAt(raw: string | null | undefined) {
  const v = String(raw ?? "").trim();
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return "-";
}

const COLUMNS: AdminBoardColumnDef[] = [
  { key: "question", header: "질문", link: true },
  { key: "published", header: "게시", width: "5rem", align: "center" },
  { key: "created", header: "등록일", width: "7rem", align: "center" },
];

export default async function AdminFaqsPage() {
  let items: AdminBoardRow[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("faqs")
      .select("id, question, is_published, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      href: adminPath(`/faqs/${row.id}`),
      searchText: String(row.question ?? ""),
      published: Boolean(row.is_published),
      cells: {
        question: String(row.question ?? ""),
        published: row.is_published ? "게시" : "비게시",
        created: formatCreatedAt(row.created_at as string | null),
      },
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <AdminBoardListClient
      title="FAQ"
      description="목록은 등록일 최신순입니다."
      noun="FAQ"
      items={items}
      loadError={loadError}
      registerHref={adminPath("/faqs/new")}
      searchPlaceholder="질문"
      columns={COLUMNS}
    />
  );
}
