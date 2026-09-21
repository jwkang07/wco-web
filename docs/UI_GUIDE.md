# 우리챔버오케스트라 — UI 가이드 (브랜드·레이아웃)

공개 서비스의 **색·타이포·레이아웃·헤더** 기준입니다.  
폼 버튼·피드백은 아래 문서로 **분리**합니다 (나무말미와 동일 구조).

| 주제 | 문서 |
|------|------|
| 버튼 위치·크기 | [`UI_BUTTON_GUIDE.md`](UI_BUTTON_GUIDE.md) |
| 오류·성공·빈 목록 | [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md) |
| 관리자 전체 | [`ADMIN_UI_GUIDE.md`](ADMIN_UI_GUIDE.md) 외 `ADMIN_*` |
| 코딩 규칙 | [`CODING_RULES.md`](CODING_RULES.md) |
| 문서 목록 | [`README.md`](README.md) |

> 입력 폼 UX 원칙(인라인 피드백 등)은 나무말미에서 참고. 브랜드·색은 WCO 토큰.

---

## 1. 브랜드·색상

복지관 CI 연계. 상세 HEX는 [`reference/goodwoori-ci-colors.md`](reference/goodwoori-ci-colors.md).

| 토큰 | HEX | 용도 |
|------|-----|------|
| `wco-orange` | `#E85A24` | 포인트, CTA, hover 글자, 활성 링크 |
| `wco-grey` | `#262626` | 제목·본문 |
| `wco-peach` | `#FBE8E6` | 섹션 배경, 헤더 구분 |
| `wco-muted` | `#6B6B6B` | 보조 문구, 비활성 메뉴 |
| white | `#FFFFFF` | 기본 배경 |

**원칙**

- 히어로 배경: `wco-grey` (홈은 이미지 + 그라데이션)
- 섹션 강조: peach / `neutral-50` 리듬
- 헤더 하단: 오렌지 3px 라인
- hover 시 **배경 반전(주황 fill + 흰 글자)** 금지 — 글자색만 (헤더·내비)
- **관리자 주 버튼에 `wco-orange` 채움 사용 금지**

---

## 2. 타이포·폰트

| 항목 | 규칙 |
|------|------|
| 본문·제목 | **Noto Sans KR** (`app/layout.tsx`) |
| `.font-serif` | 동일 고딕 (`globals.css`) |
| 본문 | `text-base`, `leading-relaxed` |
| 페이지 제목(h1) | 히어로: `text-3xl` → `lg:text-5xl`, `font-bold` |

---

## 3. 레이아웃

| 요소 | 규칙 |
|------|------|
| 콘텐츠 폭 | `.container` — `min(1120px, 92%)` |
| 페이지 골격 | `PageShell` → `Hero` + (선택) `SubNav` + 본문 |
| 홈 | `Hero` + 섹션 블록 |

### 히어로 높이

`components/Hero.tsx`의 `HERO_HEIGHT_CLASS` / `MAIN_HERO_HEIGHT_CLASS`.

- 하위 페이지: 고정 높이 상수 사용
- 패딩으로 높이 만들지 않음

### 섹션

- 한 섹션 = 한 목적·한 헤드라인
- 카드는 상호작용·목록 단위에만. 히어로에 카드 남용 금지

---

## 4. 헤더·내비

`components/SiteHeader.tsx`

- sticky, 로고 좌 + 메뉴 우
- 활성: `text-wco-orange`
- 모바일: 햄버거 드로어
- 상위 메뉴는 가능하면 **첫 하위 콘텐츠**로 랜딩 (허브 목차 지양)

로고: 사용자 제공 PNG만. CI 임의 재가공 금지.  
경로: `public/images/logo/wco-header-logo.png`

---

## 5. 푸터

`components/SiteFooter.tsx` — `site.footer` / `site.parentOrgUrl` 단일 소스.

---

## 6. 톤·카피

- 연주자로서 **당당하고 담담한** 톤
- 동정 프레이밍 지양
- 복지관 소속 상·하단 명시
- 메뉴: `공연문의` (띄어쓰기 없음)

---

## 7. 단원·사진

- 홈 미리보기: **얼굴 단독 초상보다** 악기/손/단체 컷 권장 (갈등·동의 이슈)
- `/musicians` 실명·초상: **동의 후**만 공개
- 임시 얼굴 crop을 장기 에셋으로 쓰지 않음

---

## 8. 체크리스트 (레이아웃 PR)

- [ ] `PageShell` / `Hero` 높이 상수 준수?
- [ ] 색이 `wco-*` 토큰인가?
- [ ] 로고 임의 가공 없는가?
- [ ] 폼이 있으면 [`UI_BUTTON_GUIDE.md`](UI_BUTTON_GUIDE.md) / [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md)도 봤는가?

---

## 9. 관련

| 문서 | 내용 |
|------|------|
| [`DEVELOPMENT.md`](DEVELOPMENT.md) | 스택·배포 |
| [`CODING_RULES.md`](CODING_RULES.md) | 코드 경계 |
| 나무말미 | `nm_dev/docs/UI_*` |
