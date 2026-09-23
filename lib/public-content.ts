import {
  history as fallbackHistory,
  performancePhotos as fallbackPerformances,
  pressArticles as fallbackPress,
  musicianSections as fallbackMusicianSections,
  type MusicianSection,
} from "@/lib/content";
import { contactFaqs as fallbackFaqs } from "@/lib/seo";
import { siteImages } from "@/lib/site";
import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

function media(path: string | null | undefined, fallback: string) {
  return getSupabasePublicUrl(path) || fallback;
}

export async function getPageHero(sectionKey: string) {
  try {
    const sb = createServiceClient();
    const { data: selected } = await sb
      .from("page_heroes")
      .select("*")
      .eq("section_key", sectionKey)
      .eq("is_selected", true)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    const data =
      selected ??
      (
        await sb
          .from("page_heroes")
          .select("*")
          .eq("section_key", sectionKey)
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle()
      ).data;
    if (!data) return null;
    const image = getSupabasePublicUrl(data.image_path as string | null);
    if (!image) return null;
    return {
      title: data.title as string,
      description: data.description as string,
      image,
      alt: (data.image_alt as string) || "",
      position: (data.image_position as string) || "center center",
    };
  } catch {
    return null;
  }
}

export async function getPublishedHistories() {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("histories")
      .select("year, body")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) {
      return fallbackHistory.map((h) => ({ year: h.year, text: h.text }));
    }
    return data.map((h) => ({ year: h.year as string, text: h.body as string }));
  } catch {
    return fallbackHistory.map((h) => ({ year: h.year, text: h.text }));
  }
}

export async function getPublishedPerformances(opts?: { homeOnly?: boolean }) {
  try {
    const sb = createServiceClient();
    let q = sb
      .from("performances")
      .select("title, caption, year, image_path, show_on_home")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (opts?.homeOnly) q = q.eq("show_on_home", true);
    const { data, error } = await q;
    if (error || !data?.length) {
      const list = opts?.homeOnly
        ? fallbackPerformances.slice(0, 2)
        : fallbackPerformances;
      return list.map((p) => ({
        title: p.title,
        caption: p.caption,
        year: p.year,
        imageSrc: p.imageSrc,
      }));
    }
    return data.map((p) => ({
      title: p.title as string,
      caption: p.caption as string,
      year: p.year as string,
      imageSrc: media(p.image_path as string | null, siteImages.photoConcert),
    }));
  } catch {
    const list = opts?.homeOnly
      ? fallbackPerformances.slice(0, 2)
      : fallbackPerformances;
    return list.map((p) => ({
      title: p.title,
      caption: p.caption,
      year: p.year,
      imageSrc: p.imageSrc,
    }));
  }
}

export async function getPublishedPress(opts?: { homeOnly?: boolean }) {
  try {
    const sb = createServiceClient();
    let q = sb
      .from("press_articles")
      .select("title, source, published_on, href, show_on_home")
      .eq("is_published", true)
      .order("published_on", { ascending: false });
    if (opts?.homeOnly) q = q.eq("show_on_home", true);
    const { data, error } = await q;
    if (error || !data?.length) {
      const list = opts?.homeOnly ? fallbackPress.slice(0, 3) : fallbackPress;
      return list.map((a) => ({
        date: a.date,
        title: a.title,
        source: a.source,
        href: a.href,
      }));
    }
    return data.map((a) => ({
      date: (a.published_on as string) || "",
      title: a.title as string,
      source: a.source as string,
      href: (a.href as string) || "#",
    }));
  } catch {
    const list = opts?.homeOnly ? fallbackPress.slice(0, 3) : fallbackPress;
    return list.map((a) => ({
      date: a.date,
      title: a.title,
      source: a.source,
      href: a.href,
    }));
  }
}

export async function getPublishedMusicianSections(): Promise<MusicianSection[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("musicians")
      .select("name, instrument, section_name, role, photo_path, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) {
      return fallbackMusicianSections.map((s) => ({
        name: s.name,
        description: s.description,
        members: [...s.members],
      }));
    }
    const order: string[] = [];
    const map = new Map<string, MusicianSection>();
    for (const row of data) {
      const sectionName = row.section_name as string;
      if (!map.has(sectionName)) {
        const fallback = fallbackMusicianSections.find((s) => s.name === sectionName);
        order.push(sectionName);
        map.set(sectionName, {
          name: sectionName,
          description: fallback?.description ?? "",
          members: [],
        });
      }
      map.get(sectionName)!.members.push({
        name: row.name as string,
        instrument: row.instrument as string,
        role: (row.role as string) || undefined,
        photoSrc: getSupabasePublicUrl(row.photo_path as string | null),
      });
    }
    return order.map((name) => map.get(name)!);
  } catch {
    return fallbackMusicianSections.map((s) => ({
      name: s.name,
      description: s.description,
      members: [...s.members],
    }));
  }
}

export async function getPublishedFaqs() {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("faqs")
      .select("question, answer")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return [...fallbackFaqs];
    return data.map((f) => ({
      question: f.question as string,
      answer: f.answer as string,
    }));
  } catch {
    return [...fallbackFaqs];
  }
}
