# 우리챔버오케스트라 — 개발 가이드

코드 구조·배포·개발 관행입니다. 나무말미는 동일 UI 복제가 아니라 **기능·패턴 참고**입니다.

- **코딩 규칙:** [`CODING_RULES.md`](CODING_RULES.md) (공개/관리자 경계)
- **공개 UI:** [`UI_GUIDE.md`](UI_GUIDE.md) · [`UI_BUTTON_GUIDE.md`](UI_BUTTON_GUIDE.md) · [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md)
- **관리자 UI:** [`ADMIN_UI_GUIDE.md`](ADMIN_UI_GUIDE.md) · [`ADMIN_UI_BUTTON_GUIDE.md`](ADMIN_UI_BUTTON_GUIDE.md) · [`ADMIN_UI_UX_GUIDE.md`](ADMIN_UI_UX_GUIDE.md)
- **문서 목록:** [`README.md`](README.md)

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
| DB·파일 | **Supabase** (PostgreSQL + Storage) |

> 공개: 소개 + 문의(접수 → 관리자 상태·메모). 답변 메일은 시스템이 보내지 않음.  
> 관리자: 히어로·활동·단원·FAQ·문의·작업 이력. 단원 공개 동의는 이후.  
> 이메일·외부 API 자동화는 1차 범위 밖.

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
- 배포: `git push origin main` 또는 `npx vercel deploy --prod`

### 나무말미와 같은 원칙

1. **Git push → GitHub → Vercel Redeploy**
2. `NEXT_PUBLIC_*`는 빌드 시점에 박힘 — URL 변경 시 **재빌드**
3. 시크릿 키는 서버 전용 — 클라이언트·Git에 넣지 않음

---

## 3. 폴더 구조

```
wco_web/
├── app/                    # App Router
│   ├── layout.tsx          # 공개 셸
│   ├── page.tsx            # 홈
│   ├── about|activities|musicians|employment|contact/
│   ├── admin/              # 관리자 (예정) — 공개 layout과 분리
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── (공개) Hero, PageShell, SiteHeader …
│   └── admin/              # 관리자 전용 컴포넌트 (예정)
├── lib/
│   ├── site.ts · content.ts · seo.ts
│   └── admin-* (예정)
├── public/
│   ├── images/
│   └── llms.txt
├── docs/                   # UI·코딩 가이드 (README.md)
└── scripts/
```

### 단일 소스

- **메뉴·푸터·로고:** `lib/site.ts`
- **히어로 높이:** `components/Hero.tsx`
- **색 토큰:** `app/globals.css` `@theme`

---

## 4. 페이지 추가 (공개)

1. `lib/site.ts`의 `nav`에 항목 추가
2. `app/{section}/page.tsx` 생성 + `PageShell`
3. [`UI_GUIDE.md`](UI_GUIDE.md) 체크리스트
4. 폼이면 [`UI_BUTTON_GUIDE.md`](UI_BUTTON_GUIDE.md) · [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md)

---

## 5. 폼·문의 연동 (기능 참고)

나무말미에 있는 아래 **기능**을 WCO에도 써도 된다. 파일을 그대로 붙이지 말고, WCO 컴포넌트·카피로 다시 맞춘다.

| 참고할 기능 | WCO에서의 방향 |
|-------------|----------------|
| 폼 UI 유틸·인라인 피드백 | 공개 문의 폼에 같은 UX 원칙 적용 |
| 성공 패널·액션 버튼 패턴 A/B | WCO 색·문구로 구현 |
| 관리자 피드백·패턴 F | `components/admin/`에 WCO용으로 구현 |
| 검증·honeypot·sanitize | 동일 원칙 |

검증: 이중 검증, 첫 오류만, honeypot, sanitize.

### 외부 연동

| 항목 | WCO 1차 |
|------|---------|
| 문의 답변 | 전화·개별 메일(운영). 시스템 자동 답장 없음 |
| 문의 관리 | 상태 변경 + 메모 |
| 이메일·외부 API | 없음 |
| DB·Storage | Supabase |

---

## 6. 코드 스타일 (요약)

자세한 내용: [`CODING_RULES.md`](CODING_RULES.md)

| 항목 | 규칙 |
|------|------|
| 컴포넌트 | Server Component 기본 |
| CSS | 공개 `wco-*` / 관리자 중립 `#5a554c` |
| 범위 | 요청된 기능만 |

---

## 7. SEO·메타

| 항목 | 위치 |
|------|------|
| metadataBase · OG · canonical | `app/layout.tsx` |
| JSON-LD | `components/JsonLd.tsx` + `lib/seo.ts` |
| robots / sitemap / llms.txt | `app/robots.ts`, `app/sitemap.ts`, `public/llms.txt` |

도메인 확정 시 `NEXT_PUBLIC_SITE_URL` + `llms.txt` URL 갱신.  
관리자·시안 경로는 sitemap/llms에 넣지 않음.

---

## 8. 로고·에셋

- 헤더 로고: 제공 PNG만 — 임의 재디자인 금지
- CI: `docs/reference/woori_CI.ai`

---

## 9. 체크리스트

- [ ] `npm run build` 통과
- [ ] 올바른 UI 가이드(공개 vs 관리자) 준수
- [ ] `.env*` 미커밋
- [ ] push 후 Vercel 확인

---

## 10. 관련 문서

| 문서 | 위치 |
|------|------|
| 문서 인덱스 | [`README.md`](README.md) |
| 코딩 규칙 | [`CODING_RULES.md`](CODING_RULES.md) |
| 나무말미 | `nm_dev/docs/*` |
