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
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
});
