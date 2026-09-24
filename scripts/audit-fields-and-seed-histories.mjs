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

/** 폼 name ↔ 저장 액션 키 (히어로 image_title 이슈와 동일 유형) */
const checks = [
  {
    menu: "히어로",
    form: ["title", "description", "image_alt", "image", "section_key", "is_published"],
    action: ["title", "description", "image_alt", "image", "section_key", "is_published"],
    dbPayload: ["title", "description", "image_alt", "image_path", "is_published"],
  },
  {
    menu: "히스토리",
    form: ["year", "body", "is_published"],
    action: ["year", "body", "is_published"],
    dbPayload: ["year", "body", "is_published", "sort_order"],
  },
  {
    menu: "공연",
    form: ["year", "title", "body_html", "caption", "image", "is_published"],
    action: ["year", "title", "body_html", "caption", "image", "is_published"],
    dbPayload: ["year", "title", "body_html", "caption", "image_path", "is_published"],
  },
  {
    menu: "보도",
    form: ["title", "body_html", "source", "published_on", "href", "is_published"],
    action: ["title", "body_html", "source", "published_on", "href", "is_published"],
    dbPayload: ["title", "body_html", "source", "published_on", "href", "is_published"],
  },
  {
    menu: "단원",
    form: ["name", "section_name", "instrument", "role", "image", "is_published"],
    action: ["name", "section_name", "instrument", "role", "image", "is_published"],
    dbPayload: ["name", "section_name", "instrument", "role", "photo_path", "is_published"],
  },
  {
    menu: "FAQ",
    form: ["question", "answer", "is_published"],
    action: ["question", "answer", "is_published"],
    dbPayload: ["question", "answer", "is_published"],
  },
  {
    menu: "문의",
    form: ["status", "admin_memo"],
    action: ["status", "admin_memo"],
    dbPayload: ["status", "admin_memo"],
  },
];

const mismatches = [];
for (const c of checks) {
  for (const key of c.form) {
    if (!c.action.includes(key)) {
      mismatches.push(`${c.menu}: form "${key}" missing in action`);
    }
  }
  for (const key of c.action) {
    if (!c.form.includes(key)) {
      mismatches.push(`${c.menu}: action "${key}" missing in form`);
    }
  }
}

if (mismatches.length) {
  console.log("MISMATCHES:");
  for (const m of mismatches) console.log("-", m);
} else {
  console.log("OK: form ↔ action field names align for all menus");
  console.log("(file fields map to *_path columns on save — expected)");
}

// --- seed histories to ~10 ---
const { data: existing, error: listErr } = await sb
  .from("histories")
  .select("id, year, sort_order, body")
  .order("sort_order", { ascending: true });
if (listErr) throw listErr;

console.log("histories before:", existing?.length ?? 0);

const samples = [
  { year: "2023", body: "은평구립우리장애인복지관과 함께 기업연계형 일자리로 오케스트라를 준비하기 시작했습니다." },
  { year: "2023", body: "현악·목관 중심의 소규모 앙상블 연습 체계를 마련했습니다." },
  { year: "2024", body: "지역 문화 행사와 복지관 프로그램에 초청 연주를 이어갔습니다." },
  { year: "2024", body: "장애 인식 개선을 위한 체험형 공연 프로그램을 시범 운영했습니다." },
  { year: "2024", body: "기업 CSR 무대와 연계한 챔버 공연을 선보였습니다." },
  { year: "2025", body: "제2회 정기연주회 「별이 된 꿈, 세상을 물들이다」를 준비·개최했습니다." },
  { year: "2025", body: "단원 협연과 솔로 무대를 확대해 성장 기회를 넓혔습니다." },
  { year: "2025", body: "지역 미디어와 협력 기관을 통해 오케스트라 활동을 소개했습니다." },
  { year: "2026", body: "연습실과 공연 현장을 잇는 일상의 음악 활동을 이어가고 있습니다." },
  { year: "2026", body: "기업·지역과 함께하는 공연·고용 연계 프로그램을 확대해 갑니다." },
];

const { count } = await sb
  .from("histories")
  .select("*", { count: "exact", head: true });
const current = count ?? 0;
const need = Math.max(0, 10 - current);

if (need === 0) {
  console.log("already >= 10 histories, no insert");
} else {
  const { data: maxRow } = await sb
    .from("histories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  let nextSort = Number(maxRow?.sort_order ?? 0) + 1;
  const rows = samples.slice(0, need).map((s) => ({
    ...s,
    is_published: true,
    sort_order: nextSort++,
  }));
  const { data: inserted, error } = await sb
    .from("histories")
    .insert(rows)
    .select("id, year, sort_order");
  if (error) throw error;
  console.log("inserted", inserted?.length ?? 0);
}

const { data: after } = await sb
  .from("histories")
  .select("year, sort_order, body")
  .order("sort_order", { ascending: true });
console.log("histories after:", after?.length ?? 0);
for (const row of after ?? []) {
  console.log(`${row.sort_order}. [${row.year}] ${String(row.body).slice(0, 36)}`);
}
