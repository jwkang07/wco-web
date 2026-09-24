-- 공지사항 (나무말미 news_post notice 보드와 유사 — WCO는 단일 테이블)
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_html text not null default '',
  show_on_home boolean not null default false,
  is_pinned boolean not null default false,
  view_count int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notices_list_idx
  on public.notices (is_pinned desc, created_at desc);

create index if not exists notices_home_idx
  on public.notices (show_on_home, created_at desc);

alter table public.notices enable row level security;

notify pgrst, 'reload schema';
