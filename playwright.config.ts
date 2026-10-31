import { defineConfig, devices } from "@playwright/test";

/**
 * 스모크 E2E (`npm run test:e2e`)
 *
 * - 기본: 이 저장소를 production 빌드 후 `next start`(포트 3100)로 띄워 검사
 * - PLAYWRIGHT_BASE_URL 을 주면 서버를 띄우지 않고 그 주소를 검사 (예: 이미 켜 둔 dev 서버)
 * - Supabase env(.env.local)가 없으면 앱이 정적 폴백으로 동작 → 상세 진입 테스트는 skip
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT || 3100);
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const baseURL = externalBaseURL || `http://localhost:${PORT}`;

/**
 * 테스트 서버 전용 관리자 계정 — Playwright가 띄우는 서버에만 주입(.env.local 값보다 우선).
 * 운영 계정과 무관. PLAYWRIGHT_BASE_URL 로 외부 서버를 검사할 때는 E2E_ADMIN_* 를 직접 줘야 로그인 테스트가 돈다.
 */
if (!externalBaseURL) {
  process.env.E2E_ADMIN_USERNAME ||= "e2e-admin";
  process.env.E2E_ADMIN_PASSWORD ||= "e2e-local-test-only";
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: externalBaseURL
    ? undefined
    : {
        // CI는 직전 단계에서 build 하므로 start만
        command: process.env.CI
          ? `npm run start -- -p ${PORT}`
          : `npm run build && npm run start -- -p ${PORT}`,
        url: baseURL,
        env: {
          ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME!,
          ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD!,
          ADMIN_SESSION_SECRET: "e2e-session-secret-local-only",
        },
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
});
