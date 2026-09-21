# 우리챔버오케스트라 — 코딩 규칙

나무말미(`nm_dev`)와 **같은 계열**의 Next.js 스택을 쓰되, 화면·카피는 WCO 기준으로 둔다.  
나무말미는 **기능·패턴 참고**이며 복붙·동일 UI 복제가 아니다.  
UI 세부(색·버튼·피드백)는 UI 가이드, 이 문서는 **코드 구조·경계**를 본다.

서비스(공개)와 관리자(`/admin`)는 **레이어·컴포넌트·버튼 패턴을 섞지 않는다.**

---

## 1. 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 App Router |
| UI | React 19, TypeScript |
| 스타일 | Tailwind CSS v4 |
| 배포 | Vercel |
| DB·파일 | **Supabase** (PostgreSQL + Storage) |
| 외부 메일/API | 1차 없음. 문의 답은 전화·개별 메일(운영) |

---

## 2. 디렉터리 계약

```
app/
  (공개 라우트) about|activities|musicians|employment|contact|…
  admin/                 # 관리자 전용 (layout 분리)
    (panel)/             # 인증 후 셸
    login/               # 관리자 로그인
  actions는 도메인 옆 또는 admin/**/actions.ts
components/
  (공개) Hero, PageShell, SiteHeader, Form* …
  admin/                 # AdminFormFeedback, AdminEmptyTableRow …
lib/
  site.ts, content.ts, seo.ts, form-ui.ts …
  admin-*.ts / admin-db/ # 관리자 도메인·매퍼
```

| 규칙 | 내용 |
|------|------|
| 공개 컴포넌트 | `components/` 루트 |
| 관리자 컴포넌트 | `components/admin/` 만 |
| 공개이 `admin/` import 금지 | 반대도 가급적 금지 (공유은 `lib/` 순수 유틸만) |
| 단일 소스 | 메뉴·푸터·연락처 → `lib/site.ts` |

---

## 3. 컴포넌트·데이터

1. **Server Component 기본** — 폼·헤더·인터랙션만 `"use client"`.
2. **Server Actions** — `app/**/actions.ts`. 검증은 `lib/*`, 화면은 결과만.
3. **매퍼** — DB `snake_case` ↔ UI `camelCase` 분리 (`lib/admin-db/mappers.ts` 예정).
4. **sanitize** — 사용자·리치텍스트 HTML은 저장 전 sanitize.
5. **revalidatePath** — 관리자 저장 후 공개 경로 갱신.
6. **시크릿** — `SERVICE_ROLE`·SMTP 비밀번호는 서버 전용. `NEXT_PUBLIC_*`에 넣지 않음.

---

## 4. 스타일

| 구분 | 규칙 |
|------|------|
| 공개 | `wco-orange` / `wco-grey` / `wco-peach` / `wco-muted` 토큰만. 임의 hex 지양 |
| 관리자 | 중립 `#5a554c` 주 버튼. 공개 주황은 링크·배지 수준만 |
| radius | 공개 폼 `rounded-xl` · 관리자 액션 `rounded` |
| import | `@/` alias |

---

## 5. 폼 UX (코드 관점)

| 구분 | 구현 |
|------|------|
| 공개 | `FormAlertMessages` / `FormSuccessPanel` / `formFieldClass` / 패턴 A·B |
| 관리자 | `AdminFormFeedback` / `failAdminField` / 패턴 F |
| 검증 | 클라이언트 + 서버 이중. UI `*` ↔ 서버 필수 일치 |
| 첫 오류만 | 포커스 이동. 연속 `alert` 금지 |

상세: [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md), [`ADMIN_UI_UX_GUIDE.md`](ADMIN_UI_UX_GUIDE.md).

---

## 6. 라우트·SEO

- 공개: `export const metadata`, `lib/seo.ts`, robots/sitemap/llms.txt
- 시안·임시 경로(`/contact1` 등)는 robots disallow, sitemap 제외
- 관리자 경로는 sitemap·llms.txt에 **넣지 않음**

---

## 7. Git·작업 범위

- 요청된 기능만 — unrelated 리팩터 금지
- `.env*` 커밋 금지
- `npm run build` 통과 후 푸시
- 커밋 메시지: 저장소 최근 스타일 (`feat:` / `fix:` / `docs:`)

---

## 8. 나무말미 참고 방식

나무말미는 **검증된 기능·패턴의 참고**다. UI·카피·페이지 구성을 그대로 쓰거나 파일을 복붙하라는 뜻이 아니다.

재사용해도 되는 것(예시):
- 인라인 폼 피드백, 첫 오류 포커스, honeypot·sanitize
- 관리자 패턴 F(목록/취소 · 삭제 · 저장), `AdminFormFeedback`
- Server Actions + mapper, (필요 시) 가벼운 세션 패턴

WCO에서 따로 정하는 것:
- 브랜드·레이아웃·카피·메뉴·관리 범위
- 컴포넌트 API·폴더 구조 (필요하면 새로 짜도 됨)

### 외부 연동 (메일·API)

1차: **시스템 메일 발송·외부 API 없음.**  
문의 답변은 운영이 전화·개별 메일로 하고, 관리자는 상태·메모만 둔다.  
이후 알림 메일이 필요하면 그때 최소 범위로 검토한다.

구현 시 `nm_dev`를 보고 **동작이 맞는지** 확인한 뒤, WCO 토큰·카피로 다시 만든다.

---

## 9. 체크리스트 (PR)

- [ ] 공개/관리자 가이드 중 올바른 쪽을 따랐는가?
- [ ] `"use client"`가 꼭 필요한 파일만인가?
- [ ] 시크릿·`.env`가 커밋에 없는가?
- [ ] 관리자 저장 후 공개 캐시 무효화를 넣었는가? (해당 시)
- [ ] `npm run build` 통과?
