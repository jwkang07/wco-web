import { cache } from "react";
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

export type PublicPageHero = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

async function fetchPageHero(sectionKey: string): Promise<PublicPageHero | null> {
  try {
    const sb = createServiceClient();
    // 게시 1건만 — is_selected는 게시 저장 시 함께 맞춤
    const { data } = await sb
      .from("page_heroes")
      .select("title, description, image_path, image_alt")
      .eq("section_key", sectionKey)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    const image = getSupabasePublicUrl(data.image_path as string | null);
    if (!image) return null;
    return {
      title: data.title as string,
      description: data.description as string,
      image,
      alt: (data.image_alt as string) || "",
    };
  } catch {
    return null;
  }
}

/** 요청 내 중복 호출만 합침 — CMS 게시는 즉시 반영 (data cache 사용 안 함) */
export const getPageHero = cache(async (sectionKey: string) => {
  return fetchPageHero(sectionKey);
});

export async function getPublishedHistories() {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("histories")
      .select("year, body")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("year", { ascending: true })
      .order("id", { ascending: true });
    if (error || !data?.length) {
      return fallbackHistory.map((h) => ({ year: h.year, text: h.text }));
    }
    return data.map((h) => ({ year: h.year as string, text: h.body as string }));
  } catch {
    return fallbackHistory.map((h) => ({ year: h.year, text: h.text }));
  }
}

export type PublicPerformance = {
  id: string;
  title: string;
  caption: string;
  year: string;
  imageSrc: string;
  bodyHtml: string;
  dateLabel: string;
};

export type PublicPress = {
  id: string;
  title: string;
  source: string;
  date: string;
  dateLabel: string;
  href: string;
  bodyHtml: string;
};

function formatDateLabel(raw: string | null | undefined) {
  const v = String(raw ?? "").trim();
  if (!v) return "";
  // date or timestamptz → YYYY.MM.DD
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return v;
}

function mapPerformance(
  p: {
    id: string;
    title: string;
    caption: string;
    year: string;
    image_path?: string | null;
    body_html?: string | null;
    created_at?: string | null;
    imageSrc?: string;
  },
  opts?: { fallbackImage?: boolean },
): PublicPerformance {
  const year = p.year || "";
  const fromPath = getSupabasePublicUrl(p.image_path ?? null);
  const imageSrc =
    p.imageSrc ??
    fromPath ??
    (opts?.fallbackImage === false ? "" : siteImages.photoConcert);
  return {
    id: p.id,
    title: p.title,
    caption: p.caption,
    year,
    imageSrc,
    bodyHtml: (p.body_html as string) || "",
    dateLabel: year || formatDateLabel(p.created_at) || "",
  };
}

function mapPress(a: {
  id: string;
  title: string;
  source: string;
  published_on?: string | null;
  href?: string | null;
  body_html?: string | null;
  date?: string;
}): PublicPress {
  const date = a.date ?? (a.published_on as string) ?? "";
  return {
    id: a.id,
    title: a.title,
    source: a.source,
    date,
    dateLabel: formatDateLabel(date),
    href: (a.href as string) || "#",
    bodyHtml: (a.body_html as string) || "",
  };
}

export async function getPublishedPerformances(opts?: {
  homeOnly?: boolean;
}): Promise<PublicPerformance[]> {
  try {
    const sb = createServiceClient();
    let q = sb
      .from("performances")
      .select(
        "id, title, caption, year, image_path, body_html, created_at, show_on_home, is_pinned",
      )
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("year", { ascending: false })
      .order("id", { ascending: false });
    if (opts?.homeOnly) q = q.eq("show_on_home", true);
    const { data, error } = await q;
    if (error || !data?.length) {
      const list = opts?.homeOnly
        ? fallbackPerformances.slice(0, 2)
        : fallbackPerformances;
      return list.map((p, i) =>
        mapPerformance({
          id: `fallback-perf-${i}`,
          title: p.title,
          caption: p.caption,
          year: p.year,
          imageSrc: p.imageSrc,
          body_html: p.caption ? `<p>${p.caption}</p>` : "",
        }),
      );
    }
    return data.map((p) =>
      mapPerformance({
        id: p.id as string,
        title: p.title as string,
        caption: p.caption as string,
        year: p.year as string,
        image_path: p.image_path as string | null,
        body_html: p.body_html as string | null,
        created_at: p.created_at as string | null,
      }),
    );
  } catch {
    const list = opts?.homeOnly
      ? fallbackPerformances.slice(0, 2)
      : fallbackPerformances;
    return list.map((p, i) =>
      mapPerformance({
        id: `fallback-perf-${i}`,
        title: p.title,
        caption: p.caption,
        year: p.year,
        imageSrc: p.imageSrc,
        body_html: p.caption ? `<p>${p.caption}</p>` : "",
      }),
    );
  }
}

export async function getPublishedPerformanceById(
  id: string,
): Promise<PublicPerformance | null> {
  if (!id || id.startsWith("fallback-")) return null;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("performances")
      .select(
        "id, title, caption, year, image_path, body_html, created_at, view_count",
      )
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;

    const nextViews = Number(data.view_count ?? 0) + 1;
    void (async () => {
      try {
        await sb
          .from("performances")
          .update({ view_count: nextViews })
          .eq("id", id);
      } catch {
        /* ignore view bump errors */
      }
    })();

    return mapPerformance(
      {
        id: data.id as string,
        title: data.title as string,
        caption: data.caption as string,
        year: data.year as string,
        image_path: data.image_path as string | null,
        body_html: data.body_html as string | null,
        created_at: data.created_at as string | null,
      },
      { fallbackImage: false },
    );
  } catch {
    return null;
  }
}

export async function getPublishedPress(opts?: {
  homeOnly?: boolean;
}): Promise<PublicPress[]> {
  try {
    const sb = createServiceClient();
    let q = sb
      .from("press_articles")
      .select(
        "id, title, source, published_on, href, body_html, show_on_home, is_pinned, created_at",
      )
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (opts?.homeOnly) q = q.eq("show_on_home", true);
    const { data, error } = await q;
    if (error || !data?.length) {
      const list = opts?.homeOnly ? fallbackPress.slice(0, 5) : fallbackPress;
      return list.map((a, i) =>
        mapPress({
          id: `fallback-press-${i}`,
          title: a.title,
          source: a.source,
          date: a.date,
          href: a.href,
          body_html: "",
        }),
      );
    }
    return data.map((a) =>
      mapPress({
        id: a.id as string,
        title: a.title as string,
        source: a.source as string,
        published_on: a.published_on as string | null,
        href: a.href as string | null,
        body_html: a.body_html as string | null,
      }),
    );
  } catch {
    const list = opts?.homeOnly ? fallbackPress.slice(0, 5) : fallbackPress;
    return list.map((a, i) =>
      mapPress({
        id: `fallback-press-${i}`,
        title: a.title,
        source: a.source,
        date: a.date,
        href: a.href,
        body_html: "",
      }),
    );
  }
}

export async function getPublishedPressById(
  id: string,
): Promise<PublicPress | null> {
  if (!id || id.startsWith("fallback-")) return null;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("press_articles")
      .select("id, title, source, published_on, href, body_html, view_count")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;

    const nextViews = Number(data.view_count ?? 0) + 1;
    void (async () => {
      try {
        await sb
          .from("press_articles")
          .update({ view_count: nextViews })
          .eq("id", id);
      } catch {
        /* ignore view bump errors */
      }
    })();

    return mapPress({
      id: data.id as string,
      title: data.title as string,
      source: data.source as string,
      published_on: data.published_on as string | null,
      href: data.href as string | null,
      body_html: data.body_html as string | null,
    });
  } catch {
    return null;
  }
}

export type PublicNotice = {
  id: string;
  title: string;
  dateLabel: string;
  bodyHtml: string;
};

function mapNotice(row: {
  id: string;
  title: string;
  body_html?: string | null;
  created_at?: string | null;
}): PublicNotice {
  return {
    id: row.id,
    title: row.title,
    dateLabel: formatDateLabel(row.created_at) || "-",
    bodyHtml: String(row.body_html ?? ""),
  };
}

export async function getPublishedNotices(opts?: {
  homeOnly?: boolean;
}): Promise<PublicNotice[]> {
  try {
    const sb = createServiceClient();
    let q = sb
      .from("notices")
      .select("id, title, body_html, show_on_home, is_pinned, created_at")
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (opts?.homeOnly) {
      q = q.eq("show_on_home", true).limit(5);
    }
    const { data, error } = await q;
    if (error || !data?.length) return [];
    return data.map((row) =>
      mapNotice({
        id: row.id as string,
        title: row.title as string,
        body_html: row.body_html as string | null,
        created_at: row.created_at as string | null,
      }),
    );
  } catch {
    return [];
  }
}

export async function getPublishedNoticeById(
  id: string,
): Promise<PublicNotice | null> {
  if (!id) return null;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("notices")
      .select("id, title, body_html, created_at, view_count")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;

    const nextViews = Number(data.view_count ?? 0) + 1;
    void (async () => {
      try {
        await sb.from("notices").update({ view_count: nextViews }).eq("id", id);
      } catch {
        /* ignore */
      }
    })();

    return mapNotice({
      id: data.id as string,
      title: data.title as string,
      body_html: data.body_html as string | null,
      created_at: data.created_at as string | null,
    });
  } catch {
    return null;
  }
}

export async function getPublishedMusicianSections(): Promise<MusicianSection[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("musicians")
      .select("name, instrument, section_name, role, photo_path, created_at")
      .eq("is_published", true)
      .order("section_name", { ascending: true })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
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
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (error || !data?.length) return [...fallbackFaqs];
    return data.map((f) => ({
      question: f.question as string,
      answer: f.answer as string,
    }));
  } catch {
    return [...fallbackFaqs];
  }
}
