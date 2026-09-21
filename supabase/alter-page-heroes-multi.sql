-- page_heroes: 메뉴별 다중 비주얼 + 선정(노출) — Supabase SQL Editor에서 실행
-- 기존 section_key UNIQUE 를 해제하고, 메뉴당 여러 건·1건 선정을 지원합니다.

alter table public.page_heroes
  add column if not exists is_selected boolean not null default false,
  add column if not exists is_published boolean not null default true,
  add column if not exists sort_order int not null default 0,
  add column if not exists created_at timestamptz not null default now();

-- UNIQUE(section_key) 제거 (이름 환경마다 다를 수 있어 둘 다 시도)
alter table public.page_heroes drop constraint if exists page_heroes_section_key_key;
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.page_heroes'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) ilike '%section_key%'
  ) then
    execute (
      select 'alter table public.page_heroes drop constraint ' || quote_ident(conname)
      from pg_constraint
      where conrelid = 'public.page_heroes'::regclass
        and contype = 'u'
        and pg_get_constraintdef(oid) ilike '%section_key%'
      limit 1
    );
  end if;
end $$;

-- 기존 1건씩 있던 행은 해당 메뉴 선정으로 표시
update public.page_heroes set is_selected = true where is_selected = false;

create index if not exists page_heroes_section_sort_idx
  on public.page_heroes (section_key, sort_order, created_at desc);

create index if not exists page_heroes_section_selected_idx
  on public.page_heroes (section_key, is_selected)
  where is_selected = true;
