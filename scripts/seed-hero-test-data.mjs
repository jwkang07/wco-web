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

/** 공개 폴더 이미지 — Storage 업로드 없이 테스트 가능 */
const IMAGES = [
  "/images/hero/hero-main.png",
  "/images/hero/hero-about.png",
  "/images/photos/photo-concert.png",
  "/images/photos/photo-rehearsal.png",
  "/images/photos/photo-musicians.png",
];

async function main() {
  const { data: existing, error: listErr } = await sb
    .from("page_heroes")
    .select("id, section_key, title, is_published, is_selected");
  if (listErr) throw listErr;
  console.log("before:", existing?.length ?? 0, "rows");

  const rows = [];
  let img = 0;
  for (const section of SECTIONS) {
    for (let n = 1; n <= 2; n += 1) {
      const publishFirst = n === 1;
      rows.push({
        section_key: section.key,
        title: `[테스트] ${section.label} 비주얼 ${n}`,
        description: `${section.label} 상단비주얼 테스트 설명 ${n}번입니다.`,
        image_path: IMAGES[img % IMAGES.length],
        image_alt: `${section.label} 테스트 이미지 ${n}`,
        is_published: publishFirst,
        is_selected: publishFirst,
        sort_order: n,
        updated_at: new Date().toISOString(),
      });
      img += 1;
    }
  }

  // 메뉴별로 기존 게시·선정 해제 후 테스트 행 추가 (기존 데이터는 유지하되 충돌 방지)
  for (const section of SECTIONS) {
    const { error: clearErr } = await sb
      .from("page_heroes")
      .update({
        is_published: false,
        is_selected: false,
        updated_at: new Date().toISOString(),
      })
      .eq("section_key", section.key);
    if (clearErr) throw clearErr;
  }

  const { data: inserted, error } = await sb
    .from("page_heroes")
    .insert(rows)
    .select("id, section_key, title, is_published, is_selected");
  if (error) throw error;

  console.log("inserted:", inserted.length);
  for (const section of SECTIONS) {
    const mine = inserted.filter((r) => r.section_key === section.key);
    console.log(
      section.key,
      mine.map((r) => `${r.title}(게시=${r.is_published})`).join(" | "),
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
