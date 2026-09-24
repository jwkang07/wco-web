-- 보도자료 상단고정·조회수 (공연활동과 동일 패턴)
alter table public.press_articles
  add column if not exists is_pinned boolean not null default false;

alter table public.press_articles
  add column if not exists view_count int not null default 0;

create index if not exists press_list_idx
  on public.press_articles (is_pinned desc, created_at desc);

notify pgrst, 'reload schema';
