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

const samples = [
  {
    title: "2026년 정기연주회 일정 안내",
    body_html:
      "<p>2026년 정기연주회 일정을 안내드립니다. 자세한 프로그램은 추후 공지합니다.</p>",
    show_on_home: true,
    is_pinned: true,
  },
  {
    title: "연습실 이용 시간 변경 안내",
    body_html:
      "<p>다음 주부터 연습실 이용 시간이 조정됩니다. 단원 여러분께서는 변경된 시간표를 확인해 주세요.</p>",
    show_on_home: true,
    is_pinned: true,
  },
  {
    title: "기업연계형 일자리 상담 접수 안내",
    body_html:
      "<p>기업연계형 일자리 상담을 받고 계십니다. 공연문의 메뉴를 통해 신청해 주세요.</p>",
    show_on_home: true,
    is_pinned: false,
  },
  {
    title: "장애 인식 개선 공연 자원봉사자 모집",
    body_html:
      "<p>지역 공연을 함께할 자원봉사자를 모집합니다. 관심 있으신 분은 연락 주시기 바랍니다.</p>",
    show_on_home: true,
    is_pinned: false,
  },
  {
    title: "홈페이지 개편 안내",
    body_html:
      "<p>우리챔버오케스트라 홈페이지가 새로워졌습니다. 활동·단원·고용연계 정보를 한곳에서 확인하세요.</p>",
    show_on_home: true,
    is_pinned: false,
  },
  {
    title: "추석 연휴 사무실 휴무 안내",
    body_html:
      "<p>추석 연휴 기간 동안 사무실이 휴무입니다. 문의는 연휴 이후 순차적으로 답변드립니다.</p>",
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "단원 정기 검진 및 건강 안내",
    body_html:
      "<p>단원 여러분을 위한 정기 건강 안내를 공유합니다. 관련 서류는 복지관에서 안내합니다.</p>",
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "초청 공연 문의 접수 기간 안내",
    body_html:
      "<p>하반기 초청 공연 문의를 접수합니다. 희망일 최소 3~4주 전 문의를 권장합니다.</p>",
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "안전 교육 이수 안내",
    body_html:
      "<p>공연·연습 안전을 위한 교육을 진행합니다. 일정은 개별 안내드립니다.</p>",
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "촬영·취재 협조 요청",
    body_html:
      "<p>공연 현장 촬영·취재를 원하시면 사전에 공연문의로 협조 요청을 남겨 주세요.</p>",
    show_on_home: false,
    is_pinned: false,
  },
];

const { count } = await sb
  .from("notices")
  .select("*", { count: "exact", head: true });
console.log("before:", count);

if ((count ?? 0) > 0) {
  const { error: delErr } = await sb
    .from("notices")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;
}

const now = Date.now();
const rows = samples.map((s, i) => ({
  ...s,
  is_published: true,
  view_count: Math.max(0, 40 - i * 3),
  created_at: new Date(now - i * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}));

const { data, error } = await sb
  .from("notices")
  .insert(rows)
  .select("id, title, show_on_home, is_pinned");
if (error) {
  console.error(error);
  process.exit(1);
}
console.log("inserted", data?.length ?? 0);
for (const row of data ?? []) {
  console.log(
    `- ${row.show_on_home ? "[홈]" : "    "} ${row.is_pinned ? "[고정]" : "      "} ${row.title}`,
  );
}
