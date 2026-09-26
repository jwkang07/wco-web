# 코딩·경계 (에이전트 공통)

상세: [`docs/CODING_RULES.md`](../../docs/CODING_RULES.md), [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md)

- 공개 컴포넌트 ↔ `components/admin/` 섞지 말 것
- Server Component 기본, 필요 시에만 `"use client"`
- Server Actions + `lib/*` 검증. HTML sanitize. 저장 후 `revalidatePath`
- 시크릿·`.env*` 커밋 금지. `SERVICE_ROLE` 서버 전용
- 공개 스타일: `wco-*` 토큰 / 관리자 주 액션: `#5a554c`
- 요청 범위만 수정
- 실행 가능 작업은 에이전트가 직접 수행 (로그인·결제 등 사용자 전용 인증만 예외)
