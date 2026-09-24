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
  { key: "section", header: "악기군", width: "6.5rem" },
  { key: "name", header: "이름", width: "8rem", link: true },
  { key: "instrument", header: "악기" },
  { key: "published", header: "게시", width: "5rem", align: "center" },
  { key: "created", header: "등록일", width: "7rem", align: "center" },
];

export default async function AdminMusiciansPage() {
  let items: AdminBoardRow[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("musicians")
      .select("id, name, section_name, instrument, is_published, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      href: adminPath(`/musicians/${row.id}`),
      searchText: `${row.name ?? ""} ${row.section_name ?? ""} ${row.instrument ?? ""}`,
      published: Boolean(row.is_published),
      cells: {
        section: String(row.section_name ?? ""),
        name: String(row.name ?? ""),
        instrument: String(row.instrument || "-"),
        published: row.is_published ? "게시" : "비게시",
        created: formatCreatedAt(row.created_at as string | null),
      },
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <AdminBoardListClient
      title="우리단원"
      description="목록은 등록일 최신순입니다."
      noun="단원"
      description="목록은 등록일 최신순입니다."
      noun="단원"
      items={items}
      loadError={loadError}
      registerHref={adminPath("/musicians/new")}
      searchPlaceholder="이름·악기군·악기"
      columns={COLUMNS}
    />
  );
}
