import { adminPath } from "@/lib/admin-path";
import {
  PerformanceListClient,
  type PerformanceListItem,
} from "@/components/admin/PerformanceListClient";
import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

function formatCreatedAt(raw: string | null | undefined) {
  const v = String(raw ?? "").trim();
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return "";
}

export default async function AdminPerformancesPage() {
  let items: PerformanceListItem[] = [];
  let loadError: string | undefined;
  try {
    const sb = createServiceClient();
    // view_count 미적용 DB 대비: 먼저 전체 컬럼, 실패 시 폴백 후 0 처리
    let data: Record<string, unknown>[] | null = null;
    const full = await sb
      .from("performances")
      .select(
        "id, title, year, image_path, show_on_home, is_pinned, is_published, view_count, created_at",
      )
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("year", { ascending: false })
      .order("id", { ascending: false });
    if (full.error) {
      const msg = full.error.message || "";
      if (msg.includes("view_count")) {
        const fallback = await sb
          .from("performances")
          .select(
            "id, title, year, image_path, show_on_home, is_pinned, is_published, created_at",
          )
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .order("year", { ascending: false })
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
      year: String(row.year ?? ""),
      imageUrl: getSupabasePublicUrl(row.image_path as string | null) ?? null,
      showOnHome: Boolean(row.show_on_home),
      isPinned: Boolean(row.is_pinned),
      isPublished: Boolean(row.is_published),
      viewCount: Number(row.view_count ?? 0) || 0,
      createdAt: String(row.created_at ?? ""),
      createdAtLabel: formatCreatedAt(row.created_at as string | null),
      searchText: `${row.title ?? ""} ${row.year ?? ""}`,
    }));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "unknown";
  }

  return (
    <PerformanceListClient
      items={items}
      loadError={loadError}
      registerHref={adminPath("/performances/new")}
    />
  );
}
