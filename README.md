# wco_web

**우리챔버오케스트라 (Woori Chamber Orchestra)** 공식 홈페이지 프로젝트입니다.

## 개요

- **운영**: 은평구립우리장애인복지관 기업연계형 일자리
- **복지관**: [goodwoori.or.kr](https://www.goodwoori.or.kr/main/index.php)
- **1차 목적**: 소개 (독립 사이트, 복지관 홈페이지에서 링크)
- **운영 주체**: 오케스트라 운영담당자

## 참고 자료

- `docs/reference/woori_CI.ai` — 복지관 CI 벡터 원본
- `docs/reference/goodwoori-ci-colors.md` — CI 색상·적용 원칙
- `docs/share/design-direction.html` — **디자인 디렉션 공유용 문서** (다른 사람에게 전달)
- `docs/share/우리챔버오케스트라_디자인디렉션_v0.1.zip` — 공유용 ZIP

## 상태

1차 골격 완료 — 우리챔버오케스트라 소개 · 활동 소개 · 단원 소개 · 기업고용연계 · 공연 문의

## 배포

- **Production**: https://wco-web.vercel.app
- **Vercel 프로젝트**: `jwkang07-4525s-projects/wco-web`

```bash
npm install
npm run dev
npm run build
npx vercel deploy --prod
```

개발 서버(`npm run dev`)는 `.next-dev` 캐시를 쓰고, 빌드(`npm run build`)는 `.next`를 사용합니다.  
빌드와 개발을 동시에 돌려도 서버가 깨지지 않으며, 오류로 종료되면 2초 후 자동 재시작합니다.
