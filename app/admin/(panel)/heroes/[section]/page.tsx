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
      .select("id, title, image_path, is_selected, is_published, updated_at, sort_order")
      .eq("section_key", section)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    items = (data ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title ?? ""),
      imageUrl: getSupabasePublicUrl(row.image_path as string | null),
      isSelected: Boolean(row.is_selected),
      isPublished: row.is_published !== false,
      updatedAt: row.updated_at
        ? new Date(String(row.updated_at)).toLocaleDateString("ko-KR")
        : "-",
    }));
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
