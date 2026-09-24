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

const rows = [
  {
    title: "우리챔버오케스트라, 은평 문화의 밤 무대에 서다",
    source: "은평신문",
    published_on: "2025-05-12",
    href: "#",
    body_html:
      "<p>은평구 문화의 밤에서 우리챔버오케스트라가 초청 공연을 펼쳤습니다. 관객과 함께한 앙상블이 큰 호응을 얻었습니다.</p>",
    is_published: true,
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "발달장애 연주자와 함께하는 일자리 모델 주목",
    source: "한겨레",
    published_on: "2025-04-28",
    href: "#",
    body_html:
      "<p>기업연계형 일자리와 공연 활동을 결합한 WCO의 모델이 소개됐습니다. 연습실에서 무대로 이어지는 일상의 의미를 조명합니다.</p>",
    is_published: true,
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "제2회 정기연주회 「별이 된 꿈」 성황리에 마무리",
    source: "문화일보",
    published_on: "2025-02-20",
    href: "#",
    body_html:
      "<p>제2회 정기연주회가 성황리에 막을 내렸습니다. 단원들의 연주와 관객의 박수가 무대를 가득 채웠습니다.</p>",
    is_published: true,
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "복지관과 손잡은 장애 인식 개선 콘서트",
    source: "서울복지뉴스",
    published_on: "2024-12-08",
    href: "#",
    body_html:
      "<p>지역 복지관과 함께한 인식 개선 콘서트에서 단원들이 직접 연주와 이야기를 나눴습니다.</p>",
    is_published: true,
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "챔버 앙상블로 기업 사회공헌 무대 열어",
    source: "매일경제",
    published_on: "2024-09-18",
    href: "#",
    body_html:
      "<p>기업 CSR 행사에 맞춤형 챔버 앙상블을 선보이며 음악으로 장애 인식 개선 메시지를 전했습니다.</p>",
    is_published: true,
    show_on_home: false,
    is_pinned: false,
  },
  {
    title: "연습실에서 피어난 협업, 지역 공연으로 이어지다",
    source: "경기일보",
    published_on: "2024-07-05",
    href: "#",
    body_html:
      "<p>일상 연습과 리허설이 지역 초청 공연으로 이어진 과정을 소개합니다. 함께 만드는 무대의 가치를 조명했습니다.</p>",
    is_published: true,
    show_on_home: false,
    is_pinned: false,
  },
];

const { data, error } = await sb
  .from("press_articles")
  .insert(rows)
  .select("id, title, published_on");
if (error) {
  console.error(error);
  process.exit(1);
}
console.log("inserted", data?.length ?? 0);
for (const row of data ?? []) {
  console.log("-", row.published_on, row.title);
}

const { count } = await sb
  .from("press_articles")
  .select("*", { count: "exact", head: true });
console.log("total press_articles:", count);
