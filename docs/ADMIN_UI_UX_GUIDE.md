# 관리자 UI — UX 메모 (피드백·삭제·빈 목록)

버튼은 [`ADMIN_UI_BUTTON_GUIDE.md`](ADMIN_UI_BUTTON_GUIDE.md).  
이 문서는 **그 외 UX**만 고정한다. 공개 서비스 UX와 섞지 않는다.

원칙은 나무말미 admin UX(인라인 피드백·삭제 confirm 등)를 **기능 참고**.

적용 범위: `/admin` **모든 등록·수정 폼** 및 상세의 입력 액션(메모·답변·상태 변경 등). 로그인 화면 제외.

예정 도메인 예: 공연·활동, 보도, 단원, 문의, 기업·아티스트 접수, 히어로·설정, 관리자 계정.

---

## 1. 원칙

1. **운영자 효율** — 클릭·확인 창을 최소화하되, 되돌리기 어려운 행동은 한 번 더 묻는다.
2. **화면마다 같은 말투** — 빈 목록·삭제·저장 실패 문구가 제각각이면 안 된다.
3. **검증·오류·동일 화면 성공은 인라인** — `AdminFormFeedback`.  
   `confirm`은 삭제·메일 발송 등에 유지.

구현 (나무말미와 동일 패턴):

- `components/admin/AdminFormFeedback.tsx`
- `components/admin/AdminEmptyTableRow.tsx`
- `components/admin/AdminActionForm.tsx`
- `lib/admin-ui-messages.ts`
- `lib/admin-form-focus.ts` (`failAdminField`)

---

## 2. 피드백

| 상황 | 권장 | 비고 |
|------|------|------|
| 필수·형식 오류 | `AdminFormFeedback` (error) | 탭 순서 **첫 실패만** + `failAdminField`. UI `*` = 검증 필수 |
| 서버 저장/삭제 실패 | 동일 인라인 error | 화면 유지 |
| 저장 성공 | 목록 이동 **또는** 인라인 success | |
| 중간 확인(중복 등) | `confirm` | 선택지가 필요할 때 |

**하지 말 것**

- 성공·실패를 구분 없는 회색 박스만
- 검증 실패를 연속 `alert` — 인라인 **한** 메시지 + 포커스

---

## 3. 삭제·파괴

| 규칙 | 내용 |
|------|------|
| 확인 | 삭제·메일 등 **되돌리기 어려운 행동**은 `confirm` 필수 |
| 문구 | `adminConfirmDelete("단원")`처럼 **대상이 보이게** |
| 버튼 | outline / 위험 톤. 주 저장(`#5a554c`)과 같은 스타일 금지 |

---

## 4. 빈 목록

| 상태 | 문구 예 |
|------|---------|
| 데이터 없음 | `등록된 ○○이(가) 없습니다.` |
| 검색/필터 없음 | `검색 결과가 없습니다.` |
| 로드 실패 | `불러오지 못했습니다.` (+ 짧은 detail) |

`hasActiveFilter`는 **적용된** 검색·필터 기준. 정렬만 바꾼 경우는 검색으로 치지 않음.

---

## 5. 체크리스트

- [ ] 삭제 = confirm + outline?
- [ ] 빈 목록 = 공통 헬퍼 / `AdminEmptyTableRow`?
- [ ] 검증 = 첫 필드 + `AdminFormFeedback`? (`alert` 금지)
- [ ] 저장 성공 후 목록 이동이 깨지지 않았는가?

---

## 6. 관련

| 문서·코드 | 역할 |
|------|------|
| [`ADMIN_UI_BUTTON_GUIDE.md`](ADMIN_UI_BUTTON_GUIDE.md) | 버튼 |
| [`ADMIN_UI_GUIDE.md`](ADMIN_UI_GUIDE.md) | 관리자 셸·레이아웃 |
| [`UI_UX_GUIDE.md`](UI_UX_GUIDE.md) | 공개 피드백 |
| 나무말미 | `ADMIN_UI_UX_GUIDE.md`, `admin-ui-messages.ts` |
