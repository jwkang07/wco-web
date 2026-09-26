import { formatSeoulDate } from "@/lib/format-seoul-date";
import { adminPath } from "@/lib/admin-path";
import {
  PressListClient,
  type PressListItem,
} from "@/components/admin/PressListClient";
import { createServiceClient } from "@/lib/supabase/admin";

function formatCreatedAt(raw: string | null | undefined) {
  return formatSeoulDate(raw);
}

export default async function AdminPressPage() {
  let items: PressListItem[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    let data: Record<string, unknown>[] | null = null;
    const full = await sb
      .from("press_articles")
      .select(
        "id, title, source, show_on_home, is_pinned, is_published, view_count, created_at",
      )
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (full.error) {
      const msg = full.error.message || "";
      if (msg.includes("view_count") || msg.includes("is_pinned")) {
        const fallback = await sb
          .from("press_articles")
          .select(
            "id, title, source, show_on_home, is_published, created_at",
          )
          .order("created_at", { ascending: false })
          .order("id", { ascending: false });
        if (fallback.error) loadError = fallback.error.message;
        data = (fallback.data as Record<string, unknown>[] | null) ?? [];
      } else {
        loadError = msg;
      }
    } else {
      data = (full.data as Record<string, unknown>[] | null) ?? [];
    }
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title ?? ""),
      source: String(row.source ?? ""),
      showOnHome: Boolean(row.show_on_home),
      isPinned: Boolean(row.is_pinned),
      isPublished: Boolean(row.is_published),
      viewCount: Number(row.view_count ?? 0) || 0,
      createdAt: String(row.created_at ?? ""),
      createdAtLabel: formatCreatedAt(row.created_at as string | null),
      searchText: `${row.title ?? ""} ${row.source ?? ""}`,
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <PressListClient
      items={items}
      loadError={loadError}
      registerHref={adminPath("/press/new")}
    />
  );
}
