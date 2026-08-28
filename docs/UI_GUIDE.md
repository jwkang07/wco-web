# 우리챔버오케스트라 — UI 가이드

공개 서비스 화면의 **색·타이포·레이아웃·헤더·폼·버튼** 기준입니다.  
운영담당자·외주·AI 에이전트가 새 페이지를 추가할 때 이 문서를 따릅니다.

> **입력 폼·피드백·버튼 패턴**은 나무말미(`nm_dev`)와 동일한 UX 원칙을 사용합니다.  
> 구현 시 나무말미의 `docs/UI_UX_GUIDE.md`, `docs/UI_BUTTON_GUIDE.md`, `lib/form-ui.ts`를 WCO 색상으로 치환해 적용합니다.

---

## 1. 브랜드·색상

복지관 CI 연계. 상세 HEX는 [`docs/reference/goodwoori-ci-colors.md`](reference/goodwoori-ci-colors.md).

| 토큰 | HEX | 용도 |
|------|-----|------|
| `wco-orange` | `#E85A24` | 포인트, CTA, hover 글자, 활성 링크 |
| `wco-grey` | `#262626` | 제목·본문 |
| `wco-peach` | `#FBE8E6` | 섹션 배경, 헤더 구분 |
| `wco-muted` | `#6B6B6B` | 보조 문구, 비활성 메뉴 |
| white | `#FFFFFF` | 기본 배경 |

**원칙**

- 히어로(메인 비주얼) 배경: `wco-grey` (홈은 이미지 + 그라데이션 오버레이)
- 섹션 강조: `variant="peach"` (`Section` 컴포넌트)
- 헤더 하단 포인트: 오렌지 3px 라인
- hover 시 **배경 반전(주황 fill + 흰 글자)** 금지 — 글자색만 변경

---

## 2. 타이포·폰트

| 항목 | 규칙 |
|------|------|
| 본문·제목 | **Noto Sans KR** 단일 (`app/layout.tsx`) |
| `.font-serif` | WCO에서도 동일 고딕 (`globals.css` — 나무말미와 같음) |
| 본문 | `text-base`, `leading-relaxed` (body `line-height: 1.75`) |
| 페이지 제목(h1) | 히어로 안: `text-3xl` → `sm:text-4xl` → `lg:text-5xl`, `font-bold` |
| 섹션 제목 | `Section` 컴포넌트 기본 (`font-serif text-xl` 스타일) |

---

## 3. 레이아웃

| 요소 | 규칙 |
|------|------|
| 콘텐츠 폭 | `.container` — `min(1120px, 92%)` |
| 페이지 골격 | `PageShell` → `Hero` + (선택) `SubNav` + 본문 |
| 홈 | `Hero` 직접 사용 + `Section` 블록 |

### 3.1 메인 비주얼(히어로) — **모든 페이지 동일 높이**

`components/Hero.tsx`의 `HERO_HEIGHT_CLASS`만 수정하면 전站 반영됩니다.

| 뷰포트 | 높이 |
|--------|------|
| 기본 | `360px` |
| `sm` | `400px` |
| `lg` | `440px` |

- 내용은 `flex items-center`로 **세로 중앙** 정렬
- 패딩으로 높이를 만들지 않음 (`py-*` 가변 높이 금지)
- 홈만 `imageSrc`·`showCta` 옵션 사용

### 3.2 섹션

- 기본: 흰 배경
- `variant="peach"`: `bg-wco-peach/40` 등 연한 피치
- 섹션 간 리듬: `Section`의 `title` + `description` 패턴 유지

---

## 4. 헤더·내비게이션

파일: `components/SiteHeader.tsx`

### 4.1 상단 바

- 한 줄: 로고(좌) + 메뉴(우, `lg` 이상)
- `sticky top-0`, 흰 배경, 하단 `border-wco-peach`
- 모바일: 햄버거 → 전체 화면 드로어

### 4.2 데스크톱 펼침 메뉴

| 항목 | 규칙 |
|------|------|
| 위치 | 메뉴 영역 **오른쪽 정렬** (`absolute top-full right-0`) |
| 폭 | `min-w-[50rem]`, `max-w-[min(100vw-2rem,58rem)]` |
| 열 | **5열 균등** (`grid-cols-5`) |
| hover 배경 | 연한 회색(`neutral-50/80`)만 — 주황/피치 fill 없음 |
| hover 글자 | `text-wco-orange/85` (상단·하위 링크) |
| 활성·현재 페이지 | `text-wco-orange` + `font-semibold` |
| 하위 없는 메뉴 | 우리단원, 공연문의 — 빈 하위 영역 없음 |
| leaf 메뉴 | 설명·「페이지 바로가기」 문구 없음 |

### 4.3 로고

- `components/SiteLogo.tsx` — **단일 `<img>`**, `site.logo.main`
- 사용자 제공 PNG만 사용. CI 재작성·과도한 트림·합성 금지
- 경로: `public/images/logo/wco-header-logo.png`

---

## 5. 푸터

- `components/SiteFooter.tsx` — 복지관 소속·주소·연락처
- `site.footer` · `site.parentOrgUrl` 참조

---

## 6. 버튼

나무말미 [`UI_BUTTON_GUIDE.md`](../../nm_dev/docs/UI_BUTTON_GUIDE.md) **패턴 A/B**를 따르되, 색만 WCO 토큰으로 치환합니다.

### 패턴 A — 단일 제출 (문의·지원 등)

```
[ 입력 필드들 ]
[████ 주 버튼 전체 폭 ████]
```

| 역할 | WCO 클래스 |
|------|------------|
| 주 버튼 | `w-full rounded-xl bg-wco-orange py-3 text-sm font-semibold text-white disabled:opacity-60` |
| 보조 링크 | `text-sm text-wco-muted` + hover `text-wco-orange` (중앙) |

### 패턴 B — 뒤로 + 저장 (향후 마이페이지 등)

- 보조 outline 왼쪽, 주 버튼 오른쪽
- 모바일: **주 버튼이 아래**

### CTA (히어로·섹션)

- 둥근 pill: `rounded-full bg-wco-orange px-6 py-2.5 text-sm font-semibold text-white`
- hover: `opacity-90` (배경색 유지)

### 금지

- 같은 「한 번 제출」 화면에서 중앙 짧은 버튼 vs 전체 폭 혼용
- 탈퇴·파괴적 행동을 일반 CTA와 같은 accent·크기로 배치

---

## 7. 입력 폼 (나무말미 동일 UX)

현재 `InquiryForm`은 **준비 중(placeholder)** 입니다. 실제 연동 시 나무말미와 **동일 구조**로 구현합니다.

### 7.1 참조 코드 (나무말미)

| 파일 | 역할 |
|------|------|
| `nm_dev/lib/form-ui.ts` | `formFieldClass`, `focusFormField` |
| `nm_dev/lib/inquiry.ts` | 필드 길이·검증·sanitize |
| `nm_dev/components/FormAlertMessages.tsx` | 인라인 오류/성공 |
| `nm_dev/components/FormSuccessPanel.tsx` | 접수 완료 패널 |
| `nm_dev/components/FormActions.tsx` | `FormActionsSingle` / `FormActionsEdit` |
| `nm_dev/components/ContactFormClient.tsx` | 고객문의 폼 레퍼런스 |

### 7.2 필드 스타일 (WCO 토큰)

`lib/form-ui.ts`에 아래와 같이 두고 **모든 공개 폼**에서 import합니다.

```ts
export const formFieldClass =
  "w-full rounded-xl border border-wco-grey/12 bg-white px-3 py-2.5 text-sm outline-none focus:border-wco-orange focus:ring-2 focus:ring-wco-peach";

export const formFieldLockedClass =
  "w-full rounded-xl border border-wco-grey/12 bg-wco-grey/[0.04] px-3 py-2.5 text-sm text-wco-grey outline-none";
```

- 모서리: **`rounded-xl`** (나무말미와 동일)
- focus: 주황 테두리 + 피치 ring

### 7.3 라벨·필수 표시

```tsx
<label htmlFor="..." className="mb-1.5 block text-sm font-medium text-wco-grey">
  이름 <span className="text-red-600">*</span>
</label>
```

- UI에 `*`가 있으면 **반드시** 클라이언트·서버 검증 일치

### 7.4 공연문의 필드 (예정)

나무말미 고객문의와 동일 규칙·길이:

| 필드 | 필수 | 최대 길이 | 비고 |
|------|------|-----------|------|
| 이름 | ○ | 20 | 한글·영문·공백만 |
| 이메일 | ○ | 50 | 형식 검증 |
| 연락처 | ○ | 15 | `02-`, `010-` 등 포맷 |
| 제목 | ○ | 80 | |
| 문의 내용 | ○ | 1000 | textarea |
| 개인정보 동의 | ○ | — | 체크박스 |

기업·아티스트 지원 폼도 동일 UX(패턴 A + `FormAlertMessages`).

### 7.5 피드백 UX (나무말미 `UI_UX_GUIDE` 동일)

| 상황 | 처리 |
|------|------|
| 검증 오류 | `FormAlertMessages` (error) — **첫 실패 1개만** + `focusFormField` |
| 서버 오류 | 동일 인라인 error, 화면 유지 |
| 접수 완료 | `FormSuccessPanel` — `alert()` 금지 |
| 성공 후 | 「홈으로」 등 CTA 링크 |

**하지 말 것**

- 화면마다 다른 오류 박스 스타일
- 검증 실패를 여러 줄로만 나열하고 포커스 없음
- `window.alert`로 성공 알림

### 7.6 스팸 방지

- honeypot 체크박스 (`website`, 화면 밖) — 나무말미 `ContactFormClient` 와 동일

---

## 8. 빈 목록·검색 (향후)

| 상태 | 문구 예 |
|------|---------|
| 데이터 없음 | `등록된 ○○이(가) 없습니다.` |
| 검색 결과 없음 | `검색 결과가 없습니다.` |
| 로드 실패 | `불러오지 못했습니다. 잠시 후 다시 시도해 주세요.` |

0건과 오류를 구분합니다.

---

## 9. 톤·카피

- 연주자·아티스트로서 **당당하고 담담한** 톤
- 동정·「불쌍」 프레이밍 지양
- 복지관 소속은 상·하단에 명시 (`site.parentOrg`)
- 메뉴명: `공연문의` (띄어쓰기 없음)

---

## 10. 체크리스트 (페이지·PR)

### 레이아웃·비주얼

- [ ] `PageShell` / `Hero` 사용, 히어로 높이 상수와 일치하는가?
- [ ] 색상이 CI 토큰(`wco-*`)만 쓰는가?
- [ ] 헤더 펼침 메뉴가 5열 균등·오른쪽 패널 규칙을 지키는가?
- [ ] 로고를 임의 가공하지 않았는가?

### 폼 (해당 시)

- [ ] `formFieldClass` / `FormActionsSingle`(패턴 A) 사용?
- [ ] 오류가 `FormAlertMessages`, 완료가 `FormSuccessPanel`?
- [ ] 첫 실패 필드만 + 포커스?
- [ ] `INQUIRY_LIMITS`와 동일 길이·검증?

---

## 11. 관련 문서

| 문서 | 내용 |
|------|------|
| [`DEVELOPMENT.md`](DEVELOPMENT.md) | 스택·배포·폴더·코드 규칙 |
| [`reference/goodwoori-ci-colors.md`](reference/goodwoori-ci-colors.md) | CI 색상 |
| 나무말미 `docs/UI_UX_GUIDE.md` | 폼 피드백 원본 |
| 나무말미 `docs/UI_BUTTON_GUIDE.md` | 버튼 패턴 원본 |
| 나무말미 `docs/DEPLOY.md` | 배포·환경 변수 레퍼런스 |
