# 우리챔버오케스트라 — 개발 가이드

코드 구조·배포·나무말미와 맞춘 개발 관행입니다.  
UI 규칙은 [`UI_GUIDE.md`](UI_GUIDE.md)를 먼저 본다.

---

## 1. 기술 스택

나무말미(`nm_dev`)와 **동일 계열**을 유지합니다.

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| UI | React 19, TypeScript |
| 스타일 | Tailwind CSS v4 |
| Node | **20+** (`.nvmrc` 권장) |
| 배포 | Vercel (GitHub 연동 CI/CD) |

> WCO 1차는 **정적 소개 + placeholder 폼** 위주.  
> DB·메일·관리자는 2차에서 나무말미 패턴(Supabase, Server Actions, SMTP)을 그대로 이식합니다.

---

## 2. 저장소·배포

| 항목 | 값 |
|------|-----|
| GitHub | `jwkang07/wco-web` |
| Production | https://wco-web.vercel.app |
| 브랜치 | `main` push → Vercel 자동 빌드 |

### 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000 (.next-dev 캐시)
npm run build    # .next 캐시
npm run lint
```

- `.env.local`은 **커밋 금지**
- 배포: `git push origin main` (Vercel 자동) 또는 `npx vercel deploy --prod`

### 나무말미와 같은 원칙

1. **Git push → GitHub → Vercel Redeploy** (수동 FTP 배포 아님)
2. `NEXT_PUBLIC_*`는 빌드 시점에 박힘 — URL 변경 시 **재빌드** 필요
3. 시크릿 키는 서버 전용 — 클라이언트·Git에 넣지 않음

---

## 3. 폴더 구조

```
wco_web/
├── app/                    # App Router 페이지
│   ├── layout.tsx          # Noto Sans KR, Header/Footer
│   ├── page.tsx            # 홈
│   ├── about/              # 우리챔버오케스트라
│   ├── activities/         # 우리활동
│   ├── musicians/          # 우리단원
│   ├── employment/         # 기업고용연계
│   └── contact/            # 공연문의
├── components/             # UI 컴포넌트
│   ├── Hero.tsx            # 메인 비주얼 (고정 높이)
│   ├── PageShell.tsx       # Hero + SubNav + 본문
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── InquiryForm.tsx     # → 2차: ContactFormClient 패턴으로 교체
│   └── ...
├── lib/
│   ├── site.ts             # 사이트 메타·nav·footer (단일 소스)
│   └── content.ts          # 단원 등 정적 콘텐츠
├── public/
│   └── images/
├── docs/
│   ├── UI_GUIDE.md
│   └── DEVELOPMENT.md
└── scripts/
    └── dev-server.mjs      # 0.0.0.0 바인딩 dev
```

### 단일 소스

- **메뉴·푸터·로고 경로**: `lib/site.ts`만 수정
- **히어로 높이**: `components/Hero.tsx`의 `HERO_HEIGHT_CLASS`
- **색 토큰**: `app/globals.css` `@theme`

---

## 4. 페이지 추가 방법

1. `lib/site.ts`의 `nav`에 항목 추가 (필요 시 `children`)
2. `app/{section}/page.tsx` 또는 `app/{section}/{slug}/page.tsx` 생성
3. **`PageShell`** 사용 (히어로·서브내비 자동)
4. [`UI_GUIDE.md`](UI_GUIDE.md) 체크리스트 확인

```tsx
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { nav } from "@/lib/site";

const section = nav.find((item) => item.href === "/about")!;

export const metadata: Metadata = { title: "페이지 제목" };

export default function ExamplePage() {
  return (
    <PageShell title="페이지 제목" description="한 줄 설명" subNav={section.children}>
      {/* 본문 */}
    </PageShell>
  );
}
```

---

## 5. 폼·문의 연동 (2차 — 나무말미 그대로)

현재 `InquiryForm`은 disabled placeholder. 연동 시 **나무말미에서 파일 단위 복사·WCO 색상 치환**을 권장합니다.

### 5.1 복사·적용 대상

| 나무말미 | WCO (신규) |
|----------|------------|
| `lib/form-ui.ts` | `lib/form-ui.ts` (WCO 클래스, [UI_GUIDE §7.2](UI_GUIDE.md)) |
| `lib/inquiry.ts` | `lib/inquiry.ts` (필드명·한도 동일) |
| `components/FormAlertMessages.tsx` | 동일 |
| `components/FormSuccessPanel.tsx` | 동일 |
| `components/FormActions.tsx` | accent → `wco-orange` |
| `app/contact/actions.ts` | Server Action + (선택) Supabase `inquiry` 테이블 |
| `components/ContactFormClient.tsx` | `InquiryFormClient.tsx` 등으로 rename |

### 5.2 UX 규칙 (요약)

- 클라이언트·서버 **이중 검증**, 첫 오류만 표시
- `useActionState` + Server Actions
- 완료: `FormSuccessPanel`, 오류: `FormAlertMessages`
- honeypot, sanitize (`lib/inquiry.ts`)

### 5.3 메일 (나무말미 DEPLOY.md 참고)

연동 시 환경 변수 예:

```env
NEXT_PUBLIC_SITE_URL=https://wco-web.vercel.app
SMTP_HOST=smtp.cafe24.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=...
MAIL_TO_ADMIN=...
```

미설정 시 DB 접수만 되고 알림 메일은 실패할 수 있음 (나무말미와 동일).

### 5.4 DB (선택)

나무말미처럼 Supabase 사용 시:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 전용)

업로드 이미지는 Storage, 정적 CI·로고는 `public/`.

---

## 6. 코드 스타일

| 항목 | 규칙 |
|------|------|
| 컴포넌트 | Server Component 기본, 폼·헤더만 `"use client"` |
| import | `@/` alias |
| 타입 | `lib/site.ts`의 `NavItem`, `NavChild` 재사용 |
| CSS | Tailwind 유틸, 임의 hex 지양 → `wco-*` 토큰 |
| metadata | 페이지마다 `export const metadata` |
| 범위 | 요청된 기능만 — unrelated 리팩터 금지 |

### 나무말미 ARCHITECTURE에서 가져올 패턴 (2차)

- Server Actions → `lib/*` 도메인 검증 → DB
- DB `snake_case` ↔ UI `camelCase` **매퍼** 분리
- `revalidatePath`로 ISR 갱신
- 사용자 HTML 입력 **sanitize**

---

## 7. SEO·메타

기초 신호는 코드에 반영되어 있습니다.

| 항목 | 위치 |
|------|------|
| metadataBase · OG · Twitter · canonical | `app/layout.tsx` |
| Organization(MusicGroup) JSON-LD | `components/JsonLd.tsx` + `lib/seo.ts` |
| robots.txt | `app/robots.ts` |
| sitemap.xml | `app/sitemap.ts` |
| llms.txt (GEO) | `public/llms.txt` |
| FAQPage schema | `app/contact/page.tsx` + `lib/seo.ts` |

운영 도메인 확정 시 `NEXT_PUBLIC_SITE_URL`을 설정하고 `public/llms.txt` URL을 맞춥니다.
시안 경로(`/contact1`~`3`)는 robots에서 disallow 합니다.

---

## 8. 로고·에셋

- 헤더 로고: 사용자 제공 PNG → `public/images/logo/wco-header-logo.png`
- **임의 재디자인·합성·과도한 트림 금지** ([UI_GUIDE §4.3](UI_GUIDE.md))
- CI 원본: `docs/reference/woori_CI.ai`

---

## 9. 체크리스트 (기능 추가·배포)

- [ ] `npm run build` 통과
- [ ] `lib/site.ts` nav/metadata 반영
- [ ] 히어로·헤더가 UI 가이드와 일치
- [ ] `.env*` 미커밋
- [ ] (폼) 나무말미 inquiry·form-ui 패턴 준수
- [ ] push 후 Vercel Preview/Production 확인

---

## 10. 관련 문서

| 문서 | 위치 |
|------|------|
| UI 가이드 | [`docs/UI_GUIDE.md`](UI_GUIDE.md) |
| CI 색상 | [`docs/reference/goodwoori-ci-colors.md`](reference/goodwoori-ci-colors.md) |
| README | [`README.md`](../README.md) |
| 나무말미 배포 | `nm_dev/docs/DEPLOY.md` |
| 나무말미 아키텍처 | `nm_dev/docs/ARCHITECTURE.md` |
| 나무말미 폼 UX | `nm_dev/docs/UI_UX_GUIDE.md` |
