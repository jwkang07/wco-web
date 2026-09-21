# 서비스 UI — UX 메모 (피드백·빈 목록)

버튼은 [`UI_BUTTON_GUIDE.md`](UI_BUTTON_GUIDE.md).  
이 문서는 **오류·성공·빈 상태**만 고정한다.  
관리자 UX와 섞지 않는다 — [`ADMIN_UI_UX_GUIDE.md`](ADMIN_UI_UX_GUIDE.md).

나무말미와 **같은 UX 원칙**(인라인 피드백, 첫 오류 포커스)을 참고한다. 화면·카피를 그대로 맞추라는 뜻이 아니다.

적용 범위: 공연문의, 기업·아티스트 문의/접수, (향후) 인증·마이페이지, 공개 목록의 빈 상태.

---

## 1. 원칙

1. **화면마다 같은 말투·톤** — 문의·접수 오류 박스가 제각각이면 안 된다.
2. **검증·오류는 인라인** — `FormAlertMessages`. 완료는 `FormSuccessPanel`.
3. **첫 실패 필드만** — 메시지 1개 + `focusFormField`. 여러 `alert` 금지.
4. **되돌리기 어려운 행동만 confirm** — 일반 검증·저장 실패에 `alert`/`confirm` 쓰지 않는다.

구현 예정: `lib/form-ui.ts`, `components/FormAlertMessages.tsx`, `components/FormSuccessPanel.tsx`  
(나무말미의 해당 기능을 참고해 WCO 토큰·카피로 구현).

---

## 2. 피드백

| 상황 | 권장 | 비고 |
|------|------|------|
| 필수·형식 오류 | `FormAlertMessages` (error) | 탭 순서 **첫 실패만** + 포커스. UI `*` = 검증 필수 |
| 서버 실패 | 동일 인라인 error, 화면 유지 | 짧은 사용자용 문구 |
| 문의·접수 **완료** | `FormSuccessPanel` | 제목 + 안내 + CTA. 성공 `alert` 금지 |
| 동일 화면 저장 성공 | `FormAlertMessages` tone=`success` | 편집 후 머무는 화면 |

**하지 말 것**

- 화면마다 다른 오류 박스 스타일
- 성공을 `window.alert`로 띄운 뒤 이동
- 검증 실패를 여러 줄만 나열하고 포커스 없음

필드: `formFieldClass` / `formFieldLockedClass` — `rounded-xl` + 주황 focus ring.

```ts
// lib/form-ui.ts (예정)
export const formFieldClass =
  "w-full rounded-xl border border-wco-grey/12 bg-white px-3 py-2.5 text-sm outline-none focus:border-wco-orange focus:ring-2 focus:ring-wco-peach";
```

---

## 3. 빈 목록·검색

| 상태 | 문구 예 |
|------|---------|
| 데이터 없음 | `등록된 ○○이(가) 없습니다.` |
| 검색 결과 없음 | `검색 결과가 없습니다.` |
| 로드 실패 | `불러오지 못했습니다. 잠시 후 다시 시도해 주세요.` |

0건과 오류·검색없음을 **구분**한다.

---

## 4. 문의·접수 필드 (공개)

나무말미 고객문의와 동일 한도·검증 원칙.

| 필드 | 필수 | 최대 | 비고 |
|------|------|------|------|
| 이름 / 담당자 | ○ | 20 | |
| 이메일 | ○ | 50 | |
| 연락처 | ○ | 15 | |
| 제목·기관명 등 | 화면별 | 80 | |
| 문의·동기 본문 | ○ | 1000 | |
| 개인정보 동의 | ○ | — | 체크 |

- honeypot (`website` 등) 유지
- sanitize 후 저장 (메일 발송은 고객 의견 후·최소 범위)

---

## 5. 체크리스트

- [ ] 오류 = `FormAlertMessages`?
- [ ] 완료 = `FormSuccessPanel`? (`alert` 아닌가?)
- [ ] 첫 필드만 + 포커스?
- [ ] `formFieldClass` 사용?
- [ ] 빈 목록이 「없음」 vs 「검색 없음」으로 나뉘는가?

---

## 6. 관련

| 문서·코드 | 역할 |
|------|------|
| [`UI_BUTTON_GUIDE.md`](UI_BUTTON_GUIDE.md) | 버튼 |
| [`ADMIN_UI_UX_GUIDE.md`](ADMIN_UI_UX_GUIDE.md) | 관리자 피드백 |
| 나무말미 | `nm_dev/docs/UI_UX_GUIDE.md`, `FormAlertMessages` 등 |
