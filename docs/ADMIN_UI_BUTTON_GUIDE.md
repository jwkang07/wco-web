# 관리자 UI — 버튼 사이즈·위치 가이드

`/admin`(또는 마스킹된 콘솔 경로) 등록·수정·목록의 버튼 기준입니다.  
공개 서비스 가이드와 **별도**이며 섞지 않습니다.  
피드백·삭제·빈 목록은 [`ADMIN_UI_UX_GUIDE.md`](ADMIN_UI_UX_GUIDE.md).

패턴 F(목록/취소 · 삭제 · 저장) **역할 구분**은 나무말미를 참고.  
**공개 accent(`wco-orange`)를 관리자 주 버튼에 쓰지 않는다.**

---

## 1. 원칙

1. **폼 하단 액션은 항상 같은 자리** — 구분선 아래, **가로 중앙**.
2. **순서 고정** — `목록/취소` → `삭제`(수정 시만) → `등록/수정`(주).
3. **주 버튼은 하나** — 저장만 채움. 삭제·목록은 outline.
4. **삭제는 확인 후** — `confirm`(또는 동등 모달). 주 버튼과 같은 채움색 금지.
5. **공개 주황 CTA를 쓰지 않음** — 관리자 주 버튼은 중립 다크.

---

## 2. 패턴 F — 폼 하단 액션 바

**언제:** 거의 모든 관리자 등록·수정 폼.

```
─────────────── border-t ───────────────
     [ 목록|취소 ]  [ 삭제? ]  [ 등록|수정 ]
```

| 요소 | 규칙 |
|------|------|
| 컨테이너 | `flex flex-wrap items-center justify-center gap-4 border-t … px-4 py-5` |
| 목록 / 취소 | Link · outline · 신규 **목록**, 수정 **취소**(또는 목록) |
| 삭제 | 수정만 · `type="button"` · outline · 주 버튼보다 **앞** |
| 등록 / 수정 | `type="submit"` · 채움 · 저장 중 `저장 중…` |

### 패턴 L — 목록·상세 뒤로

- `목록으로` / `← 목록` 텍스트 링크
- 폼 하단 액션 바(F)와 섞지 않음

---

## 3. 사이즈·스타일 토큰 (WCO 관리자)

| 역할 | 클래스 가이드 |
|------|----------------|
| outline | `rounded border border-black/20 bg-white px-5 py-2 text-sm font-medium hover:bg-black/[0.04] disabled:opacity-50` |
| 주 버튼 | `rounded bg-[#5a554c] px-5 py-2 text-sm font-medium text-white hover:bg-[#433f38] disabled:opacity-50` |

- radius: 관리자 **`rounded`** (공개 `rounded-xl`과 구분)
- 주 버튼 **`w-full`·화면 중앙 단독 금지** — 액션 바 안에서 형제와 나란히

---

## 4. 하지 말 것

- 공개처럼 주 버튼을 폼 폭 전체로 늘리기
- 삭제를 `wco-orange` 채움으로 만들기
- 화면마다 버튼 순서 바꾸기
- 공개 `FormActionsSingle` / `FormActionsEdit`를 관리자 폼에 그대로 쓰기

---

## 5. 예정 화면 매핑

| 영역 | 패턴 |
|------|------|
| 공연·활동·보도·단원 CRUD | F |
| 문의·접수 열람·메모·상태 | F 또는 상세+L |
| 사이트 설정·관리자 계정 | F |

---

## 6. 체크리스트

- [ ] `border-t` + `justify-center`인가?
- [ ] 순서: 목록/취소 → 삭제? → 등록/수정 인가?
- [ ] 주 버튼만 `#5a554c` 채움인가?
- [ ] 삭제 = outline + confirm 인가?

---

## 7. 공개 vs 관리자

| | 공개 서비스 | 관리자 |
|--|-------------|--------|
| 버튼 문서 | `UI_BUTTON_GUIDE.md` | 이 문서 |
| UX 문서 | `UI_UX_GUIDE.md` | `ADMIN_UI_UX_GUIDE.md` |
| 주 버튼 | `wco-orange`, 패턴 A/B | `#5a554c`, 패턴 F |
| radius | `rounded-xl` | `rounded` |
