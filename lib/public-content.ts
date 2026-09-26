import { cache } from "react";
import {
  history as fallbackHistory,
  performancePhotos as fallbackPerformances,
  pressArticles as fallbackPress,
  musicianSections as fallbackMusicianSections,
  type MusicianSection,
} from "@/lib/content";
import { contactFaqs as fallbackFaqs } from "@/lib/seo";
import { formatSeoulDate } from "@/lib/format-seoul-date";
import { siteImages } from "@/lib/site";
import { createServiceClient, getSupabasePublicUrl } from "@/lib/supabase/admin";

/** env 미설정 등 명시적 로컬 폴백만 — 조회 성공·0건은 빈 배열 */
function shouldUseStaticFallback() {
  return (
    process.env.WCO_USE_CONTENT_FALLBACK === "1" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export type PublicPageHero = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

async function fetchPageHero(sectionKey: string): Promise<PublicPageHero | null> {
  try {
    const sb = createServiceClient();
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

/** 요청 내 중복 호출만 합침 — CMS 즉시 반영은 layout force-dynamic + revalidatePath */
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
    if (error) throw error;
    if (!data?.length) {
      return shouldUseStaticFallback()
        ? fallbackHistory.map((h) => ({ year: h.year, text: h.text }))
        : [];
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
  return formatSeoulDate(raw);
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

async function bumpContentView(
  table: "performances" | "press_articles" | "notices",
  id: string,
) {
  try {
    const sb = createServiceClient();
    const { error } = await sb.rpc("bump_content_view", {
      p_table: table,
      p_id: id,
    });
    if (!error) return;
    // RPC 미적용 환경 — 기존 read-modify-write 폴백 (페이지 동작 유지)
    const { data } = await sb
      .from(table)
      .select("view_count")
      .eq("id", id)
      .maybeSingle();
    const next = Number(data?.view_count ?? 0) + 1;
    await sb.from(table).update({ view_count: next }).eq("id", id);
  } catch {
    /* ignore view bump */
  }
}

export async function getPublishedPerformances(opts?: {
  homeOnly?: boolean;
}): Promise<PublicPerformance[]> {
  try {
    const sb = createServiceClient();
    // 목록: body_html 제외
    let q = sb
      .from("performances")
      .select(
        "id, title, caption, year, image_path, created_at, show_on_home, is_pinned",
      )
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("year", { ascending: false })
      .order("id", { ascending: false });
    if (opts?.homeOnly) {
      q = q.eq("show_on_home", true).limit(3);
    }
    const { data, error } = await q;
    if (error) throw error;
    if (!data?.length) {
      if (!shouldUseStaticFallback()) return [];
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
        body_html: "",
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

const fetchPerformanceById = cache(async (id: string) => {
  if (!id || id.startsWith("fallback-")) return null;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("performances")
      .select(
        "id, title, caption, year, image_path, body_html, created_at",
      )
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;
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
});

/** 메타데이터용 — 조회수 증가 없음 */
export async function getPublishedPerformanceMeta(id: string) {
  return fetchPerformanceById(id);
}

/** 상세 페이지 — 요청당 조회수 +1 (메타와 분리) */
export async function getPublishedPerformanceById(
  id: string,
): Promise<PublicPerformance | null> {
  const item = await fetchPerformanceById(id);
  if (item) void bumpContentView("performances", id);
  return item;
}

export async function getPublishedPress(opts?: {
  homeOnly?: boolean;
}): Promise<PublicPress[]> {
  try {
    const sb = createServiceClient();
    let q = sb
      .from("press_articles")
      .select(
        "id, title, source, published_on, show_on_home, is_pinned, created_at",
      )
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (opts?.homeOnly) {
      q = q.eq("show_on_home", true).limit(5);
    }
    const { data, error } = await q;
    if (error) throw error;
    if (!data?.length) {
      if (!shouldUseStaticFallback()) return [];
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
        href: "#",
        body_html: "",
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

const fetchPressById = cache(async (id: string) => {
  if (!id || id.startsWith("fallback-")) return null;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("press_articles")
      .select("id, title, source, published_on, body_html")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapPress({
      id: data.id as string,
      title: data.title as string,
      source: data.source as string,
      published_on: data.published_on as string | null,
      href: "#",
      body_html: data.body_html as string | null,
    });
  } catch {
    return null;
  }
});

export async function getPublishedPressMeta(id: string) {
  return fetchPressById(id);
}

export async function getPublishedPressById(
  id: string,
): Promise<PublicPress | null> {
  const item = await fetchPressById(id);
  if (item) void bumpContentView("press_articles", id);
  return item;
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
      .select("id, title, show_on_home, is_pinned, created_at")
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
    if (opts?.homeOnly) {
      q = q.eq("show_on_home", true).limit(5);
    }
    const { data, error } = await q;
    if (error) throw error;
    if (!data?.length) return [];
    return data.map((row) =>
      mapNotice({
        id: row.id as string,
        title: row.title as string,
        body_html: "",
        created_at: row.created_at as string | null,
      }),
    );
  } catch {
    return [];
  }
}

const fetchNoticeById = cache(async (id: string) => {
  if (!id) return null;
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("notices")
      .select("id, title, body_html, created_at")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapNotice({
      id: data.id as string,
      title: data.title as string,
      body_html: data.body_html as string | null,
      created_at: data.created_at as string | null,
    });
  } catch {
    return null;
  }
});

export async function getPublishedNoticeMeta(id: string) {
  return fetchNoticeById(id);
}

export async function getPublishedNoticeById(
  id: string,
): Promise<PublicNotice | null> {
  const item = await fetchNoticeById(id);
  if (item) void bumpContentView("notices", id);
  return item;
}

export async function getPublishedMusicianSections(): Promise<MusicianSection[]> {
  try {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("musicians")
      .select("name, instrument, section_name, role, photo_path, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw error;
    if (!data?.length) {
      return shouldUseStaticFallback()
        ? fallbackMusicianSections.map((s) => ({
            name: s.name,
            description: s.description,
            members: [...s.members],
          }))
        : [];
    }
    const order: string[] = [];
    const map = new Map<string, MusicianSection>();
    for (const row of data) {
      const sectionName = row.section_name as string;
      if (!map.has(sectionName)) {
        const fallback = fallbackMusicianSections.find(
          (s) => s.name === sectionName,
        );
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
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw error;
    if (!data?.length) {
      return shouldUseStaticFallback() ? [...fallbackFaqs] : [];
    }
    return data.map((f) => ({
      question: f.question as string,
      answer: f.answer as string,
    }));
  } catch {
    return [...fallbackFaqs];
  }
}

/** OG/메타 설명용 — HTML 태그 제거 후 120~160자 */
export function plainExcerpt(htmlOrText: string, max = 155): string {
  const plain = String(htmlOrText ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max - 1).trim()}…`;
}
