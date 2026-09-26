-- =============================================================================
-- 공개 anon 권한 축소 (선택 적용 · 준비 전용)
-- =============================================================================
--
-- 【실행 안내 — 수동】
-- · Supabase Dashboard → SQL Editor에서 관리자가 파일 전체를 검토한 후 수동 실행
-- · 운영 DB 적용 전 백업 또는 스테이징 검증 권장
-- · 현재 작업에서는 실제 SQL을 실행하지 않음 (파일 준비만)
-- · 실행 후 함수·권한·RLS 정책 상태 확인
-- · 문제 발생 시: 하단 【롤백】 블록을 SQL Editor에서 실행
--
-- 【실행 후 검증】
-- · anon 키로 게시(is_published=true) 행 SELECT 가능
-- · anon 키로 비게시 행 SELECT 불가
-- · anon 키로 inquiries INSERT (필요 컬럼·동의) 가능 / SELECT·UPDATE·DELETE 불가
-- · 관리자·service_role 조회·저장은 RLS 우회로 유지
--
-- 【정책 요약】
-- · 대상 테이블별 ENABLE ROW LEVEL SECURITY
-- · 게시된 데이터만 anon SELECT / 비게시는 anon 조회 불가
-- · 문의는 INSERT만 (길이·동의 시각 검사)
-- · 최소 GRANT + 불필요 권한 REVOKE
-- · drop policy if exists → create 로 idempotent
--
-- Zero-regression: 앱 공개 조회는 당분간 service_role 유지.
-- 이 SQL 적용 + createAnonClient 전환은 별도 검증 후 진행.
-- =============================================================================

-- 1) 대상 테이블 RLS 활성화
alter table public.performances enable row level security;
alter table public.press_articles enable row level security;
alter table public.notices enable row level security;
alter table public.histories enable row level security;
alter table public.page_heroes enable row level security;
alter table public.musicians enable row level security;
alter table public.faqs enable row level security;
alter table public.inquiries enable row level security;

-- 2) 불필요 권한 REVOKE (anon / authenticated)
--    게시물: UPDATE/DELETE/INSERT 제거 (SELECT는 아래에서 최소 GRANT)
--    문의: SELECT/UPDATE/DELETE 제거 (INSERT만 허용)
revoke insert, update, delete on table public.performances from anon, authenticated;
revoke insert, update, delete on table public.press_articles from anon, authenticated;
revoke insert, update, delete on table public.notices from anon, authenticated;
revoke insert, update, delete on table public.histories from anon, authenticated;
revoke insert, update, delete on table public.page_heroes from anon, authenticated;
revoke insert, update, delete on table public.musicians from anon, authenticated;
revoke insert, update, delete on table public.faqs from anon, authenticated;
revoke select, update, delete on table public.inquiries from anon, authenticated;

-- 3) 필요한 최소 GRANT (anon만)
grant select on table public.performances to anon;
grant select on table public.press_articles to anon;
grant select on table public.notices to anon;
grant select on table public.histories to anon;
grant select on table public.page_heroes to anon;
grant select on table public.musicians to anon;
grant select on table public.faqs to anon;
grant insert on table public.inquiries to anon;

-- authenticated 에는 공개 조회·문의 INSERT를 부여하지 않음
-- service_role / postgres 는 기존 권한·RLS 우회 유지

-- 4) SELECT 정책: is_published = true 만 (idempotent)
drop policy if exists "public_read_published_performances" on public.performances;
create policy "public_read_published_performances"
  on public.performances for select to anon
  using (is_published = true);

drop policy if exists "public_read_published_press" on public.press_articles;
create policy "public_read_published_press"
  on public.press_articles for select to anon
  using (is_published = true);

drop policy if exists "public_read_published_notices" on public.notices;
create policy "public_read_published_notices"
  on public.notices for select to anon
  using (is_published = true);

drop policy if exists "public_read_published_histories" on public.histories;
create policy "public_read_published_histories"
  on public.histories for select to anon
  using (is_published = true);

drop policy if exists "public_read_published_heroes" on public.page_heroes;
create policy "public_read_published_heroes"
  on public.page_heroes for select to anon
  using (is_published = true);

drop policy if exists "public_read_published_musicians" on public.musicians;
create policy "public_read_published_musicians"
  on public.musicians for select to anon
  using (is_published = true);

drop policy if exists "public_read_published_faqs" on public.faqs;
create policy "public_read_published_faqs"
  on public.faqs for select to anon
  using (is_published = true);

-- 5) 문의 INSERT 정책 (SELECT/UPDATE/DELETE 정책 없음)
drop policy if exists "public_insert_inquiries" on public.inquiries;
create policy "public_insert_inquiries"
  on public.inquiries for insert to anon
  with check (
    char_length(coalesce(organization, '')) <= 80
    and char_length(name) > 0 and char_length(name) <= 40
    and char_length(email) > 0 and char_length(email) <= 80
    and char_length(body) > 0 and char_length(body) <= 2000
    and privacy_agreed_at is not null
  );

-- -----------------------------------------------------------------------------
-- 【롤백】문제 발생 시 SQL Editor에서 아래를 실행
-- ※ RLS를 끈 뒤에도 앱이 service_role을 쓰면 공개 조회는 동작할 수 있음.
--    anon 전환을 했다면 앱 쪽도 함께 되돌릴 것.
-- -----------------------------------------------------------------------------
-- drop policy if exists "public_read_published_performances" on public.performances;
-- drop policy if exists "public_read_published_press" on public.press_articles;
-- drop policy if exists "public_read_published_notices" on public.notices;
-- drop policy if exists "public_read_published_histories" on public.histories;
-- drop policy if exists "public_read_published_heroes" on public.page_heroes;
-- drop policy if exists "public_read_published_musicians" on public.musicians;
-- drop policy if exists "public_read_published_faqs" on public.faqs;
-- drop policy if exists "public_insert_inquiries" on public.inquiries;
--
-- revoke select on table public.performances from anon;
-- revoke select on table public.press_articles from anon;
-- revoke select on table public.notices from anon;
-- revoke select on table public.histories from anon;
-- revoke select on table public.page_heroes from anon;
-- revoke select on table public.musicians from anon;
-- revoke select on table public.faqs from anon;
-- revoke insert on table public.inquiries from anon;
--
-- (선택) RLS를 끄려면 — 운영 정책에 따라 신중히:
-- alter table public.performances disable row level security;
-- alter table public.press_articles disable row level security;
-- alter table public.notices disable row level security;
-- alter table public.histories disable row level security;
-- alter table public.page_heroes disable row level security;
-- alter table public.musicians disable row level security;
-- alter table public.faqs disable row level security;
-- alter table public.inquiries disable row level security;
