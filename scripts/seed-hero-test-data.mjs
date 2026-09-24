import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const map = new Map();
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    map.set(t.slice(0, i).trim(), v);
  }
  return map;
}

const env = loadEnv();
const sb = createClient(
  env.get("NEXT_PUBLIC_SUPABASE_URL"),
  env.get("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const SECTIONS = [
  { key: "home", label: "홈" },
  { key: "about", label: "오케스트라 소개" },
  { key: "activities", label: "우리활동" },
  { key: "musicians", label: "우리단원" },
  { key: "employment", label: "기업고용연계" },
  { key: "contact", label: "공연문의" },
];

/** 메뉴별로 서로 다른 이미지 — 게시 전환 시 육안으로 구분 */
const TEST_IMAGES = {
  home: ["/images/hero/hero-about.png", "/images/photos/photo-concert.png"],
  about: ["/images/photos/photo-rehearsal.png", "/images/photos/photo-musicians.png"],
  activities: ["/images/hero/hero-main.png", "/images/photos/photo-concert.png"],
  musicians: ["/images/hero/hero-main.png", "/images/photos/photo-rehearsal.png"],
  employment: ["/images/hero/hero-about.png", "/images/photos/photo-concert.png"],
  contact: ["/images/hero/hero-about.png", "/images/photos/photo-musicians.png"],
};

async function main() {
  const { data: existing, error: listErr } = await sb
    .from("page_heroes")
    .select("id, section_key, title, is_published, is_selected, sort_order");
  if (listErr) throw listErr;

  console.log("before:", existing?.length ?? 0, "rows (기존 유지)");

  const rows = [];
  for (const section of SECTIONS) {
    const mine = (existing ?? []).filter((r) => r.section_key === section.key);
    const maxSort = mine.reduce((m, r) => Math.max(m, Number(r.sort_order) || 0), 0);
    const images = TEST_IMAGES[section.key];

    for (let n = 1; n <= 2; n += 1) {
      rows.push({
        section_key: section.key,
        title: `[테스트] ${section.label} 비주얼 ${n}`,
        description: `${section.label} 상단비주얼 게시 전환 테스트 ${n}번입니다.`,
        image_path: images[n - 1],
        image_alt: `${section.label} 테스트 이미지 ${n}`,
        // 기존 게시건 유지 — 추가분은 비게시로 넣어 게시 전환 테스트용
        is_published: false,
        is_selected: false,
        sort_order: maxSort + n,
        updated_at: new Date().toISOString(),
      });
    }
  }

  const { data: inserted, error } = await sb
    .from("page_heroes")
    .insert(rows)
    .select("id, section_key, title, is_published, image_path");
  if (error) throw error;

  console.log("inserted:", inserted.length, "(모두 비게시)");

  const { data: after } = await sb
    .from("page_heroes")
    .select("section_key, title, is_published, is_selected, image_path, sort_order")
    .order("section_key")
    .order("sort_order");

  for (const section of SECTIONS) {
    const mine = (after ?? []).filter((r) => r.section_key === section.key);
    console.log(`\n[${section.label}] ${mine.length}건`);
    for (const r of mine) {
      const flag = r.is_published ? "게시" : "비게시";
      console.log(`  ${flag.padEnd(4)} ${r.title} → ${r.image_path}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
