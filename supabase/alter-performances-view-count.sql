alter table public.performances
  add column if not exists view_count int not null default 0;
