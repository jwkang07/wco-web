-- =============================================================================
-- 공연문의 rate limit + 조회수 원자 증가
-- =============================================================================
--
-- 【실행 안내 — 수동】
-- · Supabase Dashboard → SQL Editor에서 관리자가 파일 전체를 검토한 후 수동 실행
-- · 운영 DB 적용 전 백업 또는 스테이징 검증 권장
-- · 현재 작업에서는 실제 SQL을 실행하지 않음 (파일 준비만)
-- · 실행 후 함수·권한·RLS 정책 상태 확인
-- · 문제 발생 시: 하단 【롤백】 블록을 SQL Editor에서 실행
--
-- 【실행 후 확인 예시】
--   select proname from pg_proc where proname in ('bump_inquiry_rate','bump_content_view');
--   select relname, relrowsecurity from pg_class
--     where relname = 'inquiry_rate_buckets';
--   select grantee, privilege_type from information_schema.role_table_grants
--     where table_name = 'inquiry_rate_buckets';
--
-- Zero-regression: 앱은 RPC 실패 시 fail-open / 기존 update 폴백을 사용함.
-- 이 SQL을 적용하기 전에도 문의·상세 페이지는 정상 동작해야 함.
-- =============================================================================

-- 1) Rate limit 버킷 테이블
create table if not exists public.inquiry_rate_buckets (
  bucket_key text primary key,
  hit_count int not null default 0,
  window_ends_at timestamptz not null,
  updated_at timestamptz not null default now()
);

-- 2) RLS 활성화 (정책 없음 = anon/authenticated 행 접근 불가)
alter table public.inquiry_rate_buckets enable row level security;

-- 3) anon / authenticated / public 직접 접근 권한 회수
--    테이블 조작은 service_role + security definer 함수만 허용
revoke all on table public.inquiry_rate_buckets from anon, authenticated, public;
grant all on table public.inquiry_rate_buckets to service_role;

-- 4) 문의 rate limit — 원자적 UPSERT
--    동시 최초 요청 시 SELECT→INSERT PK 충돌로 fail-open 되지 않도록
--    INSERT ... ON CONFLICT 로 한 행에 합산
create or replace function public.bump_inquiry_rate(
  p_bucket text,
  p_limit int,
  p_window_ms int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  now_ts timestamptz := now();
  ends timestamptz := now_ts + make_interval(secs => greatest(p_window_ms, 1000) / 1000.0);
  new_count int;
begin
  insert into public.inquiry_rate_buckets (bucket_key, hit_count, window_ends_at, updated_at)
  values (p_bucket, 1, ends, now_ts)
  on conflict (bucket_key) do update
    set
      hit_count = case
        when public.inquiry_rate_buckets.window_ends_at <= now_ts then 1
        else public.inquiry_rate_buckets.hit_count + 1
      end,
      window_ends_at = case
        when public.inquiry_rate_buckets.window_ends_at <= now_ts then ends
        else public.inquiry_rate_buckets.window_ends_at
      end,
      updated_at = now_ts
  returning hit_count into new_count;

  return new_count <= p_limit;
end;
$$;

revoke all on function public.bump_inquiry_rate(text, int, int) from public, anon, authenticated;
grant execute on function public.bump_inquiry_rate(text, int, int) to service_role;

-- 5) 조회수 원자 증가 (허용 테이블만)
create or replace function public.bump_content_view(
  p_table text,
  p_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_table = 'performances' then
    update public.performances set view_count = view_count + 1 where id = p_id and is_published = true;
  elsif p_table = 'press_articles' then
    update public.press_articles set view_count = view_count + 1 where id = p_id and is_published = true;
  elsif p_table = 'notices' then
    update public.notices set view_count = view_count + 1 where id = p_id and is_published = true;
  else
    raise exception 'unsupported table';
  end if;
end;
$$;

revoke all on function public.bump_content_view(text, uuid) from public, anon, authenticated;
grant execute on function public.bump_content_view(text, uuid) to service_role;

-- -----------------------------------------------------------------------------
-- 【만료 버킷 정리】— 필요 시 SQL Editor에서 별도 실행 (앱 런타임 호출 불필요)
-- 윈도우가 끝난 지 1일 이상 지난 행만 삭제. 주기적으로(예: 주 1회) 운영 점검 시 실행.
-- -----------------------------------------------------------------------------
-- delete from public.inquiry_rate_buckets
-- where window_ends_at < now() - interval '1 day';
--
-- 정리 전후 건수 확인:
-- select count(*) from public.inquiry_rate_buckets;
-- select count(*) from public.inquiry_rate_buckets
--   where window_ends_at < now() - interval '1 day';

-- -----------------------------------------------------------------------------
-- 【롤백】문제 발생 시 SQL Editor에서 아래를 실행 (앱은 RPC 폴백으로 계속 동작)
-- -----------------------------------------------------------------------------
-- drop function if exists public.bump_inquiry_rate(text, int, int);
-- drop function if exists public.bump_content_view(text, uuid);
-- drop table if exists public.inquiry_rate_buckets;
