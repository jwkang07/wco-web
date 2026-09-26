# 배포 및 원격 푸시 정책 (Deployment & Push Policy)

> 이 규칙은 우리챔버오케스트라(wco_web) 프로젝트의 모든 AI 에이전트 작업에 항상 적용됩니다.  
> 공통 진입점: [`AGENTS.md`](../../AGENTS.md) · CMS 맥락: [`docs/AGENT_CONTEXT.md`](../../docs/AGENT_CONTEXT.md)

1. **원격 푸시 및 배포 자동 실행 절대 금지**:
   - `git push`, `vercel deploy`, `npx vercel deploy` 등의 원격 저장소 푸시 및 상용 배포 명령어를 임의로 실행하지 마십시오.
2. **로컬 작업 및 검증 우선**:
   - 모든 기능 추가, 수정, 리팩토링은 로컬 파일 수정 및 로컬 개발 서버(`http://localhost:3000`) 검증까지만 수행하십시오.
3. **명시적 요청 시에만 실행**:
   - 사용자가 대화창에서 "배포해줘", "푸시해줘" 등 명시적으로 직접 요청한 경우에만 배포 및 푸시 명령어를 실행하십시오.
