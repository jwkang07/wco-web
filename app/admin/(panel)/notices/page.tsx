import { adminPath } from "@/lib/admin-path";
import {
  NoticeListClient,
  type NoticeListItem,
} from "@/components/admin/NoticeListClient";
import { createServiceClient } from "@/lib/supabase/admin";

function formatCreatedAt(raw: string | null | undefined) {
  const v = String(raw ?? "").trim();
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return "";
}

export default async function AdminNoticesPage() {
  let items: NoticeListItem[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("notices")
      .select(
        "id, title, show_on_home, is_pinned, is_published, view_count, created_at",
      )
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title ?? ""),
      showOnHome: Boolean(row.show_on_home),
      isPinned: Boolean(row.is_pinned),
      isPublished: Boolean(row.is_published),
      viewCount: Number(row.view_count ?? 0) || 0,
      createdAt: String(row.created_at ?? ""),
      createdAtLabel: formatCreatedAt(row.created_at as string | null),
      searchText: String(row.title ?? ""),
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <NoticeListClient
      items={items}
      loadError={loadError}
      registerHref={adminPath("/notices/new")}
    />
  );
}
