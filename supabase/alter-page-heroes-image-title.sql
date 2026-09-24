-- page_heroes 정리
-- 1) is_selected 제거 (게시=노출, 메뉴당 게시 1건)
-- 2) image_alt → image_title (이미지제목)

alter table public.page_heroes
  drop column if exists is_selected;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'page_heroes'
      and column_name = 'image_alt'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'page_heroes'
      and column_name = 'image_title'
  ) then
    alter table public.page_heroes rename column image_alt to image_title;
  end if;
end $$;

drop index if exists public.page_heroes_one_selected_per_section_idx;
