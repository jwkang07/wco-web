import { notFound } from "next/navigation";
import {
  HeroSectionListClient,
  type HeroListItem,
} from "@/components/admin/HeroSectionListClient";
import {
  heroSectionLabel,
  isKnownHeroSection,
} from "@/lib/admin-heroes";
import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

export default async function AdminHeroSectionListPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!isKnownHeroSection(section)) notFound();

  let items: HeroListItem[] = [];
  try {
    const sb = createServiceClient();
    const { data } = await sb
      .from("page_heroes")
      .select(
        "id, title, image_alt, image_path, is_selected, is_published, created_at",
      )
      .eq("section_key", section)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    const isHome = section === "home";
    items = (data ?? []).map((row) => {
      const title = isHome
        ? String(row.title ?? "")
        : String(row.image_alt || row.title || "");
      return {
        id: String(row.id),
        title,
        imageUrl: getSupabasePublicUrl(row.image_path as string | null),
        isSelected: Boolean(row.is_selected),
        isPublished: row.is_published !== false,
        updatedAt: row.created_at
          ? new Date(String(row.created_at)).toLocaleDateString("ko-KR")
          : "-",
      };
    });
    // 게시 중인 건을 위에, 그 안에서는 등록일 최신순 유지
    items.sort((a, b) => {
      const liveA = a.isPublished ? 0 : 1;
      const liveB = b.isPublished ? 0 : 1;
      if (liveA !== liveB) return liveA - liveB;
      return 0;
    });
  } catch {
    items = [];
  }

  return (
    <HeroSectionListClient
      sectionKey={section}
      sectionLabel={heroSectionLabel(section)}
      items={items}
    />
  );
}
