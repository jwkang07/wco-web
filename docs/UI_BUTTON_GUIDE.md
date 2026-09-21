# 서비스 UI — 버튼 사이즈·위치 가이드

공개 서비스 폼의 버튼 배치·크기를 통일합니다.  
버튼 **패턴 A/B**(주/보조 역할)는 나무말미와 같은 기능 구분을 참고하고, **색·카피는 WCO**를 씁니다.

**오류·성공·빈 목록**은 [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md)를 본다.  
관리자는 [`ADMIN_UI_BUTTON_GUIDE.md`](ADMIN_UI_BUTTON_GUIDE.md) — **서로 섞지 않는다.**

적용 범위: 공연문의, 기업 도입 문의, 아티스트 접수, (향후) 로그인·마이페이지 등 공개 폼.

브랜드·레이아웃·헤더는 [`UI_GUIDE.md`](UI_GUIDE.md).

---

## 1. 원칙

1. **주 행동은 항상 같은 자리** — 화면마다 왼쪽·중앙·오른쪽으로 바뀌지 않게 한다.
2. **버튼은 최대 2개** — 주 버튼 1개 + (필요 시) 보조 1개. 텍스트 링크는 그 아래.
3. **위험 행동은 덜 눈에 띄게** — 삭제·철회 등은 주 플로우와 같은 자리·같은 채움색을 쓰지 않는다.
4. **모바일에서도 동일한 논리** — 쌓을 때 **주 버튼이 아래**(시각적 끝).

---

## 2. 패턴 (2가지만)

### 패턴 A — 단일 제출

**언제:** 공연문의, 기업 도입 문의, 아티스트 접수, 로그인·가입처럼 주 행동이 하나일 때.

```
[ 입력 필드들 ]
[████ 주 버튼 전체 폭 ████]
      텍스트 링크 (선택)
```

| 요소 | 규칙 |
|------|------|
| 주 버튼 | 폼 폭 **전체 (`w-full`)**, `py-3`, `rounded-xl`, `bg-wco-orange` |
| 위치 | 입력 영역 **바로 아래** |
| 보조 | 주 버튼 **아래 · 중앙** 텍스트 링크 |
| 금지 | 주 버튼만 짧게 중앙에 띄우기 |

### 패턴 B — 뒤로 + 확정

**언제:** (향후) 회원정보 수정처럼 「돌아가기」+「저장」이 있을 때.

| 요소 | 규칙 |
|------|------|
| 보조 | **왼쪽** outline |
| 주 버튼 | **오른쪽** `bg-wco-orange`, `px-5 py-2.5` 이상 |
| 모바일 | 쌓을 때 **주 버튼이 아래** |

---

## 3. WCO 토큰

| 역할 | 클래스 |
|------|--------|
| 주 버튼 A | `w-full rounded-xl bg-wco-orange py-3 text-sm font-semibold text-white disabled:opacity-60` |
| 주 버튼 B | `rounded-xl bg-wco-orange px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60` |
| 보조 outline | `rounded-xl border border-wco-grey/20 bg-white px-5 py-2.5 text-sm font-medium text-wco-grey` |
| 보조 링크 | `text-sm text-wco-muted hover:text-wco-orange` (중앙) |
| 위험 | `rounded-xl bg-red-700 …` — 전체 폭·중앙 금지 |
| 히어로 CTA | `rounded-full bg-wco-orange px-6 py-2.5` (마케팅 CTA, 폼 패턴과 별개) |

---

## 4. 화면 매핑 (예정 포함)

| 화면 | 패턴 | 주 버튼 |
|------|------|---------|
| 공연문의 | A | 문의하기 |
| 기업 도입 문의 | A | 문의하기 |
| 아티스트 접수 | A | 접수하기 |
| (향후) 로그인·가입 | A | 로그인 / 회원가입 |
| (향후) 정보 수정 | B | 저장 |

---

## 5. 체크리스트

- [ ] 패턴 A 또는 B인가?
- [ ] 주 버튼이 한 개뿐인가?
- [ ] 모바일에서 주 버튼이 “마지막 확정” 자리인가?
- [ ] 관리자 패턴 F·`#5a554c`를 공개 폼에 쓰지 않았는가?

---

## 6. 관련

| 문서 | 역할 |
|------|------|
| [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md) | 피드백·빈 목록 |
| [`UI_GUIDE.md`](UI_GUIDE.md) | 브랜드·레이아웃 |
| [`ADMIN_UI_BUTTON_GUIDE.md`](ADMIN_UI_BUTTON_GUIDE.md) | 관리자 버튼 |
| 나무말미 | `nm_dev/docs/UI_BUTTON_GUIDE.md` |
