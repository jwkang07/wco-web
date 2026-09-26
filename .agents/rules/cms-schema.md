# CMS · 스키마 · 메뉴 (에이전트 공통)

> Antigravity / Codex / Cursor 공용. 상세는 [`docs/AGENT_CONTEXT.md`](../../docs/AGENT_CONTEXT.md). 루트 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 보드형 (공연·보도·공지)

- TipTap `body_html` + sanitize, `is_pinned`, `show_on_home`(홈 최대 5), `view_count`
- 목록 정렬: `is_pinned desc` → `created_at desc` — **sort_order 쓰지 않음**
- 보도 **원문 링크(`href`) 없음** — 상세 경로 `/activities/press/[id]`, 링크는 본문에
- 삭제 시 Storage 이미지도 삭제

## 히스토리

- `sort_order` ▲▼ 수동 정렬만 유지

## 히어로

- `is_published`만으로 노출(메뉴당 게시 1건). `is_selected` 폐기
- 컬럼명 `image_alt` 유지 (`image_title`로 리네임 금지)

## 홈

- 공지 | 보도 2열 동일 평면. 보도는 출처→제목

## 관리자 내비

우리활동(히스토리/공연/보도/공지) · 우리단원 · 공연문의 · FAQ · (간격) 작업 이력

## 미사용 컬럼 삭제 예정

`press_articles.href`, `performances.sort_order`, `press_articles.sort_order`, `page_heroes.is_selected` (+ `page_heroes.sort_order` 검토)  
작업 시 schema.sql·코드·시드 동시 정리. 상세는 `docs/AGENT_CONTEXT.md` §6.
