-- 공연 상단고정
alter table public.performances
  add column if not exists is_pinned boolean not null default false;

create index if not exists performances_list_idx
  on public.performances (is_pinned desc, created_at desc);
