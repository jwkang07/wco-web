-- WCO 1차 스키마 — Supabase SQL Editor에서 실행
-- Project: wtdvzvlizcvabziihsle

create extension if not exists "pgcrypto";

-- 관리자 계정
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  display_name text not null default '',
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 작업 이력
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_username text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_logs_created_at_idx
  on public.admin_audit_logs (created_at desc);

-- 히어로 (홈 + 메뉴별) — 메뉴당 여러 비주얼, is_selected 1건이 공개 노출
create table if not exists public.page_heroes (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  title text not null default '',
  description text not null default '',
  image_path text,
  image_alt text not null default '',
  is_selected boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists page_heroes_section_sort_idx
  on public.page_heroes (section_key, sort_order, created_at desc);

-- 히스토리
create table if not exists public.histories (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  body text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists histories_sort_idx on public.histories (sort_order, year);

-- 공연 활동
create table if not exists public.performances (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text not null default '',
  year text not null default '',
  image_path text,
  show_on_home boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists performances_home_idx
  on public.performances (show_on_home, sort_order);

-- 보도자료
create table if not exists public.press_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null default '',
  published_on date,
  href text not null default '#',
  show_on_home boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists press_home_idx
  on public.press_articles (show_on_home, published_on desc nulls last);

-- 단원
create table if not exists public.musicians (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  instrument text not null default '',
  section_name text not null,
  role text not null default '',
  photo_path text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists musicians_section_idx
  on public.musicians (section_name, sort_order);

-- FAQ
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 공연문의
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  organization text not null default '',
  name text not null,
  phone text not null default '',
  email text not null,
  body text not null,
  privacy_agreed_at timestamptz not null,
  status text not null default 'received'
    check (status in ('received', 'in_progress', 'done')),
  admin_memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_phone_format check (phone ~ '^[0-9-]*$'),
  constraint inquiries_name_len check (char_length(name) <= 40),
  constraint inquiries_email_len check (char_length(email) <= 80),
  constraint inquiries_body_len check (char_length(body) <= 2000)
);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

-- RLS: 공개는 서버(service_role)만 사용. anon 직접 접근 차단.
alter table public.admins enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.page_heroes enable row level security;
alter table public.histories enable row level security;
alter table public.performances enable row level security;
alter table public.press_articles enable row level security;
alter table public.musicians enable row level security;
alter table public.faqs enable row level security;
alter table public.inquiries enable row level security;

-- Storage 버킷 (대시보드에서 public 으로 생성하거나 아래 실행)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('heroes', 'heroes', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('performances', 'performances', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('musicians', 'musicians', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- 시드: 히어로 (메뉴당 1건 선정)
insert into public.page_heroes (section_key, title, description, image_path, image_alt, is_selected, sort_order)
select * from (values
  ('home', '음악으로 세상과 만나는, 우리챔버오케스트라', '은평구립우리장애인복지관 문화일자리와 기업연계형 일자리로 구성되어 있습니다.', '/images/hero/hero-main.png', '우리챔버오케스트라 정기연주회 무대 전경', true, 1),
  ('about', '우리챔버오케스트라', '', '/images/hero/hero-about.png', '우리챔버오케스트라 정기연주회 무대 전경', true, 1),
  ('activities', '우리활동', '', '/images/photos/photo-rehearsal.png', '우리챔버오케스트라 연습 장면', true, 1),
  ('musicians', '우리단원', '', '/images/photos/photo-musicians.png', '우리챔버오케스트라 단원 연주 장면', true, 1),
  ('employment', '기업고용연계', '', '/images/photos/photo-rehearsal.png', '우리챔버오케스트라 연습 및 협연 장면', true, 1),
  ('contact', '공연문의', '', '/images/photos/photo-concert.png', '우리챔버오케스트라 공연 무대', true, 1)
) as v(section_key, title, description, image_path, image_alt, is_selected, sort_order)
where not exists (select 1 from public.page_heroes limit 1);

-- 시드: 히스토리
insert into public.histories (year, body, sort_order)
select * from (values
  ('2023', '기업연계형 일자리 프로그램으로 우리챔버오케스트라 출범', 1),
  ('2024', '지역 공연 및 장애 인식 개선 활동 확대', 2),
  ('2025', '제2회 정기연주회 「별이 된 꿈, 세상을 물들이다」 개최', 3)
) as v(year, body, sort_order)
where not exists (select 1 from public.histories limit 1);

-- 시드: 공연
insert into public.performances (title, caption, year, image_path, show_on_home, sort_order)
select * from (values
  ('제2회 정기연주회', '별이 된 꿈, 세상을 물들이다', '2025', '/images/photos/photo-concert.png', true, 1),
  ('지역 초청 공연', '은평구 문화 행사 연주', '2024', '/images/hero/hero-main.png', true, 2),
  ('연습 및 리허설', '함께 만드는 무대', '2024', '/images/photos/photo-rehearsal.png', false, 3),
  ('정기연주회', '첫 정기연주 무대', '2023', '/images/photos/photo-concert.png', false, 4)
) as v(title, caption, year, image_path, show_on_home, sort_order)
where not exists (select 1 from public.performances limit 1);

-- 시드: 보도
insert into public.press_articles (title, source, published_on, href, show_on_home, sort_order)
select * from (values
  ('발달장애 예술가의 음악, 지역을 물들이다', '지역 언론', '2025-03-15'::date, '#', true, 1),
  ('우리챔버오케스트라, 장애 인식 개선 공연 개최', '복지관 소식', '2024-11-02'::date, '#', true, 2),
  ('음악으로 일터를 만나는 기업연계형 일자리', '아름다운은행', '2024-06-20'::date, '#', true, 3)
) as v(title, source, published_on, href, show_on_home, sort_order)
where not exists (select 1 from public.press_articles limit 1);

-- 시드: FAQ
insert into public.faqs (question, answer, sort_order)
select * from (values
  ('오케스트라 전체 편성이 아닌 소규모 앙상블 초청도 가능한가요?', '네, 가능합니다. 무대 공간이나 행사 규모에 따라 현악 앙상블, 목관 앙상블, 솔로 협연 등 맞춤형으로 팀을 구성할 수 있습니다.', 1),
  ('공연 문의는 행사 며칠 전까지 접수해야 하나요?', '단원 연습과 맞춤 편성을 위해 희망일 최소 3~4주 전에 문의해 주시면 일정 조율이 원활합니다. 급한 일정은 전화로 먼저 연락해 주세요.', 2),
  ('기업 장애인식개선 교육이나 사회공헌 행사와 연계할 수 있나요?', '네. 음악 공연과 함께 장애인식개선 문화체험, 기업연계형 일자리 상담을 연계할 수 있습니다.', 3)
) as v(question, answer, sort_order)
where not exists (select 1 from public.faqs limit 1);
