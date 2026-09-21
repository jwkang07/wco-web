# Supabase 초기 설정

1. Dashboard → SQL Editor에서 `schema.sql` 전체 실행
2. Storage 버킷(`heroes`, `performances`, `musicians`)이 없으면 SQL의 insert가 생성합니다
3. 로컬 `.env.local`에 URL / anon / service_role / ADMIN_* 확인
4. Vercel 배포 시 동일 환경 변수 등록

관리자: `/admin/login`
