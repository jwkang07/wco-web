# 에이전트 컨텍스트 — CMS · 스키마 · 메뉴 (최신)

> **목적:** Cursor / Codex / Antigravity가 동일 맥락을 공유하기 위한 결정 기록.  
> **갱신:** CMS·스키마·메뉴를 바꾸면 이 문서를 같이 수정한다.  
> **기준일:** 2026-09-26

관련 코드: `lib/public-content.ts`, `app/admin/(panel)/content-actions.ts`, `supabase/schema.sql`, `lib/admin-nav.ts`, `lib/site.ts`

---

## 1. 도메인 개요

| 영역 | 공개 경로 | 관리자 | 비고 |
|------|-----------|--------|------|
| 상단비주얼 | 메뉴별 히어로 | `/admin/heroes/[section]` | 메뉴당 **게시 1건**만 공개 |
| 히스토리 | `/activities/history` | `/admin/histories` | `sort_order` ▲▼ 수동 정렬 |
| 공연 | `/activities/performances` (+상세) | `/admin/performances` | 보드형 + TipTap |
| 보도 | `/activities/press` (+상세) | `/admin/press` | 보드형 + TipTap |
| 공지 | `/activities/notices` (+상세) | `/admin/notices` | 보드형 + TipTap |
| 단원 | `/musicians` | `/admin/musicians` | |
| 공연문의 | `/contact` | `/admin/inquiries` | 시스템 메일 발송 없음 |
| FAQ | (공개 페이지 없음) | `/admin/faqs` | 관리자 CMS만. `/contact` FAQ·JSON-LD 미노출 |

상위 메뉴 클릭 시 **허브가 아니라 첫 하위**로 이동:

- 우리챔버오케스트라 → 관장 인삿말
- 우리활동 → 히스토리
- 기업고용연계 → 고용 연계 소개

우리활동 하위 히어로는 **섹션 공통** (`sectionHref="/activities"`). 하위 페이지별 히어로 오버라이드 금지.

---

## 2. 보드형 CMS (공연 · 보도 · 공지)

나무말미식 게시판 패턴. 세 도메인 공통:

| 필드/기능 | 의미 |
|-----------|------|
| `body_html` | TipTap 리치텍스트. 저장 전 sanitize (`lib/sanitize-html.ts`) |
| `is_published` | 게시/비게시 라디오 (`AdminPublishRadios`) |
| `is_pinned` | 목록 상단 고정 (관리자 목록에서 즉시 반영) |
| `show_on_home` | 홈 노출 (도메인별 상한은 §3) |
| `view_count` | 상세 조회 시 +1 |
| 목록 정렬 | `is_pinned desc` → `created_at desc` (공연은 year/id 보조) |
| 날짜 표시 | `created_at` 등 timestamptz는 **Asia/Seoul** (`lib/format-seoul-date.ts`). `published_on` date-only는 변환 없이 표기 |

### 하지 말 것

- 공연/보도/공지에 **관리자 `sort_order`로 수동 정렬**하지 않음 (히스토리만 sort_order)
- 보도에 **원문 링크(`href`) 필드·UI 없음** — 상세 본문 안 링크/이미지로 충분. 목록·홈은 `/activities/press/[id]`
- 폼에 “홈 체크박스” 두지 않음 — 목록의 메인 적용으로만 제어
- 삭제 시 DB만 지우지 말고 **Storage 이미지도 삭제** (`removeAdminImage`)
- 관리자 편집 화면에 **중첩 `<form>`** 만들지 말 것 — 삭제는 `AdminDeleteButton`(button + Server Action)

### UI 컴포넌트

| 역할 | 파일 |
|------|------|
| 공개 목록 | `components/ActivityBoard.tsx` |
| 공개 상세 | `components/ActivityArticleDetail.tsx` |
| 관리자 리치텍스트 | `components/admin/AdminRichTextField.tsx` (StarterKit에서 link/underline 비활성 후 별도 확장) |
| 관리자 목록 | `*ListClient.tsx` (Performance / Press / Notice / History) |

---

## 3. 홈(`/`) 구성 결정

- **최근 공연** 그리드 — `show_on_home` **최대 3건** (`.limit(3)`)
- **공지 | 보도** 2열 동일 평면 (`lg:grid-cols-2`, `min-w-0`) — 한쪽만 강조하지 않음
- 공지 홈: `show_on_home` **최대 5건**
- 보도 홈: `show_on_home` **최대 5건**
- 보도 행: **출처(source) → 제목** 순서 (목록 NO–출처–제목과 동일 감각)
- 그 아래 공연문의 CTA

전체 공연·공지·보도 **목록에는 `.limit(200)` 같은 임의 상한을 두지 않음** (페이지네이션 UI로 나눔).

---

## 4. 관리자 내비 (`lib/admin-nav.ts`)

```
상단비주얼 (하위: 메뉴별)
우리활동
  ├ 히스토리
  ├ 공연 활동
  ├ 보도자료
  └ 공지사항
우리단원
공연문의
FAQ
(여백 spacedBefore)
작업 이력
```

라벨: 단원 → **우리단원**, 문의 → **공연문의**.

---

## 5. 히어로 (`page_heroes`)

- 노출 조건: `is_published = true` (메뉴당 1건). 게시 저장 시 같은 `section_key` 다른 건은 비게시
- 이미지 필드명: **`image_alt`** (폼 name도 `image_alt`). `image_title`로 리네임하지 말 것 — 코드·스키마 모두 `image_alt`
- **`is_selected`는 폐기 대상** — 게시=노출. 코드에 남아 있으면 `is_published`만 쓰도록 정리
- 홈만 title/description 사용. 그 외 메뉴는 이미지제목(= image_alt) 중심
- 공개 Hero LCP: `components/Hero.tsx`에서 이미지가 있으면 `priority` + `fetchPriority="high"` (본문 이미지는 과도한 priority 금지)
- 기본 메인 비주얼 파일: `public/images/hero/hero-main.webp` (원본 PNG 보관)

---

## 6. 스키마 계약 (`supabase/schema.sql`)

### 사용 중 (유지)

| 테이블 | 핵심 컬럼 |
|--------|-----------|
| `histories` | `year`, `body`, **`sort_order`**, `is_published` |
| `performances` | `title`, `caption`, `body_html`, `year`, `image_path`, `show_on_home`, `is_pinned`, `view_count`, `is_published` |
| `press_articles` | `title`, `source`, `body_html`, `published_on`, `show_on_home`, `is_pinned`, `view_count`, `is_published` |
| `notices` | `title`, `body_html`, `show_on_home`, `is_pinned`, `view_count`, `is_published` |
| `page_heroes` | `section_key`, `title`, `description`, `image_path`, `image_alt`, `is_published` |
| `musicians` / `faqs` | 각각 `sort_order` 사용 |

### 미사용 → 삭제 예정 (다음 작업)

앱이 더 이상 의미 있게 쓰지 않음. **컬럼 drop + schema.sql 반영 + 코드/시드 정리**할 것.

| 테이블 | 컬럼 | 이유 |
|--------|------|------|
| `press_articles` | `href` | 원문링크 UI 제거. insert 시 `"#"`만 넣던 잔재 |
| `performances` | `sort_order` | 정렬이 pin+created_at으로 전환됨. 인덱스 `performances_home_idx`도 재정의 |
| `press_articles` | `sort_order` | 동일 |
| `page_heroes` | `is_selected` | 게시=노출. alter 초안: `supabase/alter-page-heroes-image-title.sql`의 drop 부분만 참고 (**image_alt→image_title 리네임은 하지 말 것**) |
| `page_heroes` | `sort_order` | 저장/목록 로직 미사용(시드만). drop 검토 |

히스토리·단원·FAQ의 `sort_order`는 **유지**.

마이그레이션 SQL은 `supabase/alter-*.sql`, 실행 스크립트는 `scripts/alter-*.mjs` 패턴을 따른다. DB 접속은 **`SUPABASE_DB_URL`만** (하드코딩 금지).

### SQL 준비 파일 (운영 DB 미실행)

| 파일 | 상태 |
|------|------|
| `supabase/alter-public-rls.sql` | **준비만.** 대상 테이블 RLS·anon 최소 GRANT/정책. 앱 anon 전환 전 스테이징 검증 필요 |
| `supabase/alter-rate-limit-and-views.sql` | **준비만.** `bump_inquiry_rate`(원자 UPSERT)·`bump_content_view`. 앱은 RPC 실패 시 fail-open/폴백 |

실행은 Supabase Dashboard → SQL Editor에서 관리자가 전체를 검토한 뒤 수동. 현재 코드 작업에서는 실행하지 않음.

### Zero-regression · 캐시 (강제 유지)

- 공개 `app/(site)/layout.tsx`의 **`export const dynamic = "force-dynamic"` 유지** — CMS 게시·수정이 공개에 즉시 반영
- 공개 DB 조회는 서버 **service_role** 클라이언트 사용 (anon RLS 전환은 SQL 적용·검증 후)
- **단순히 `force-dynamic`만 제거하는 최적화는 금지** — CMS 즉시 반영이 깨질 수 있음
- 추후 성능 개선은 `revalidate` / 태그 기반 무효화 / 공개 anon 조회를 **함께** 검증한 뒤 진행
- 문의 rate limit / 조회수 RPC는 실패 시 fail-open·기존 폴백
- Turnstile은 반복 스팸 시에만 추가 검토 (허니팟 유지)

---

## 7. 공개 메뉴 · SEO

우리활동 하위: 히스토리 · 공연 활동 · 보도자료 · **공지사항**  
(인터뷰 메뉴는 삭제됨 — 복구 금지)

- 공개 브라우저 `<title>`: 항상 **우리챔버오케스트라** (`title.absolute`). OG title/description/canonical은 상세 콘텐츠 가능
- 관리자: **우리챔버오케스트라(관리자)**
- `app/robots.ts`: 관리자 공개 경로(`/wco-console` 등) 및 `/admin` disallow
- `lib/seo.ts` `sitemapPaths`에 `/activities/notices` 포함

---

## 8. 최근 개선 요약 (2026-09-26)

- 서울 시간대 날짜 표시 (`lib/format-seoul-date.ts`)
- 문의 rate limit · 조회수 원자 증가 RPC **SQL 준비** (미적용)
- 관리자 이미지 매직바이트·10MB 제한 (`lib/admin-image.ts`)
- 관리자 삭제: 중첩 form 제거 + Server Action Promise를 transition에서 await
- 공개 페이지 브라우저 제목 고정 / robots 관리자 차단 / 공지 sitemap 반영
- TipTap StarterKit `link`·`underline` 중복 비활성
- 홈 노출 상한: 공연 3 · 보도 5 · 공지 5

---

## 9. 커밋 범위 습관

커밋에 넣지 말 것:

- `.docx-work/`, `.tmp/`, `.tmp-*`, `.next-verify-build/`, `.next-prod-verify/`
- `docs/share`의 zip·대용량 pptx/pdf (공유용 초안은 필요할 때만)
- 일회성 `scripts/check-*`, `inspect-*`, `patch-admin-*.cjs`, `tmp-*` (필요 시 별도)

넣을 것: `app/`, `components/`, `lib/`(예: `admin-image.ts`, `format-seoul-date.ts`, `inquiry-rate-limit.ts`), `supabase/`(예: `alter-public-rls.sql`, `alter-rate-limit-and-views.sql`), `AGENTS.md`, `docs/AGENT_CONTEXT.md`, 관련 `scripts/alter-*`·`seed-*`, `package.json`

---

## 10. 아직 남은 최종 작업 (별도)

- **관리자 계정·인증 보안 강화** (기본 아이디·비밀번호 관련 코드는 이번 범위에서 건드리지 않음 — 별도 최종 작업)
- Next.js 내장 PostCSS 취약점 → **Next.js 16 메이저** 별도 브랜치 검증 후 (강제 upgrade 금지). 상세: `docs/DEVELOPMENT.md`
- `alter-public-rls.sql` / `alter-rate-limit-and-views.sql` **운영 DB 수동 적용**
- 공개 페이지 캐시 전략 (`force-dynamic` 대체는 통합 검증 후에만)

---

## 11. 최근 반영 커밋

`45faf3a` — `feat: board-style CMS for performances, press, and notices`  
(TipTap, pin/home/views, 공지, 홈 공지|보도, 관리자 내비 등)
