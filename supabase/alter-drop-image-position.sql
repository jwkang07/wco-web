-- page_heroes.image_position 제거 — 공개 히어로는 center center 고정
-- Supabase SQL Editor 또는 로컬 스크립트에서 실행

alter table public.page_heroes
  drop column if exists image_position;
