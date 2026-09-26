# AGENTS.md — 우리챔버오케스트라 (wco_web)

이 파일은 **Cursor / Codex / Google Antigravity** 등 AI 에이전트가 저장소를 열었을 때 먼저 읽는 공통 지침입니다.  
채팅 기록은 도구 간에 공유되지 않으므로, **여기에 적힌 내용만** 다른 도구에서도 동일하게 적용합니다.

## 필수 문서 (우선순위)

1. [`docs/AGENT_CONTEXT.md`](docs/AGENT_CONTEXT.md) — **현재 CMS·스키마·메뉴 결정 요약 (최신)**
2. [`docs/CODING_RULES.md`](docs/CODING_RULES.md) — 공개/관리자 경계·구현 규칙
3. [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — 스택·폴더·배포
4. UI는 `docs/UI_*.md`(공개) / `docs/ADMIN_*.md`(관리자) — **서로 섞지 말 것**

Antigravity용 규칙 미러: [`.agents/rules/`](.agents/rules/)

## 절대 규칙

- 공개 컴포넌트(`components/`) ↔ 관리자(`components/admin/`) 섞지 말 것
- `.env*` / `SERVICE_ROLE` 커밋·노출 금지
- **요청 범위만** 수정 (unrelated 리팩터 금지)
- `git push` / Vercel 배포는 **사용자가 명시적으로 요청할 때만**
- 실행 가능한 작업(마이그레이션·스크립트·로컬 검증)은 에이전트가 직접 수행

## 스택 한 줄

Next.js 15 App Router · React 19 · Tailwind v4 · Supabase (Postgres + Storage) · Vercel  
GitHub: `jwkang07/wco-web` · Production: https://wco-web.vercel.app

## 작업 시작 전

스키마·보드 CMS·홈 구성을 건드리면 **반드시** `docs/AGENT_CONTEXT.md`를 읽고, 변경 후 그 문서도 함께 갱신한다.
