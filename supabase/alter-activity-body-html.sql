-- 공연·보도: 공지형 본문(HTML) 추가

alter table public.performances
  add column if not exists body_html text not null default '';

alter table public.press_articles
  add column if not exists body_html text not null default '';

-- 기존 캡션/요약을 본문으로 이전 (본문이 비어 있을 때만)
update public.performances
set body_html = concat('<p>', replace(caption, E'\n', '</p><p>'), '</p>')
where coalesce(trim(body_html), '') = ''
  and coalesce(trim(caption), '') <> '';
