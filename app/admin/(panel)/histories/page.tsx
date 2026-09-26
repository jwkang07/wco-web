import { formatSeoulDate } from "@/lib/format-seoul-date";
import { adminPath } from "@/lib/admin-path";
import {
  HistoryListClient,
  type HistoryListItem,
} from "@/components/admin/HistoryListClient";
import { createServiceClient } from "@/lib/supabase/admin";

function formatCreatedAt(raw: string | null | undefined) {
  return formatSeoulDate(raw);
}

export default async function AdminHistoriesPage() {
  let items: HistoryListItem[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("histories")
      .select("id, year, body, sort_order, is_published, created_at")
      .order("sort_order", { ascending: true })
      .order("year", { ascending: true })
      .order("id", { ascending: true });
    if (error) loadError = error.message;
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      year: String(row.year ?? ""),
      body: String(row.body ?? ""),
      sortOrder: Number(row.sort_order ?? 0) || 0,
      isPublished: Boolean(row.is_published),
      createdAtLabel: formatCreatedAt(row.created_at as string | null),
      searchText: `${row.year ?? ""} ${row.body ?? ""}`,
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <HistoryListClient
      items={items}
      loadError={loadError}
      registerHref={adminPath("/histories/new")}
    />
  );
}
