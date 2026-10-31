import { expect, test } from "@playwright/test";

// /admin 은 proxy 가 공개 관리자 경로(기본 /wco-console)로 보내므로 base path 와 무관하게 동작
test("관리자 로그인 화면이 렌더된다", async ({ page }) => {
  const res = await page.goto("/admin");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.getByText("WCO 관리자")).toBeVisible();
  await expect(page.locator("#username")).toBeVisible();
  await expect(page.locator("#password")).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test("비로그인 상태로 관리자 목록에 가면 로그인으로 보낸다", async ({ page }) => {
  await page.goto("/admin/notices");
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.locator("#password")).toBeVisible();
});

/**
 * 로그인 후 목록 진입 — 계정은 playwright.config.ts 가 테스트 서버에 주입(E2E_ADMIN_*).
 * 주의: Supabase 연결 상태면 admin_audit_logs 에 "e2e-admin 로그인" 1건이 기록된다.
 */
const adminUser = process.env.E2E_ADMIN_USERNAME;
const adminPass = process.env.E2E_ADMIN_PASSWORD;

test("로그인 후 공지 목록에 진입한다", async ({ page }) => {
  test.skip(!adminUser || !adminPass, "E2E_ADMIN_USERNAME/PASSWORD 미설정");

  // 폼에 기본값이 미리 채워져 있어, 하이드레이션 전에 입력하면 덮어써질 수 있음
  await page.goto("/admin", { waitUntil: "networkidle" });
  await page.locator("#username").fill(adminUser!);
  await page.locator("#password").fill(adminPass!);
  await expect(page.locator("#username")).toHaveValue(adminUser!);
  await expect(page.locator("#password")).toHaveValue(adminPass!);
  await page.locator('button[type="submit"]').click();
  // 로그인 화면이 관리자 루트(/wco-console)에도 렌더되므로 URL 대신 폼이 사라지는 것으로 판정
  await expect(page.locator("#password")).toHaveCount(0, { timeout: 15_000 });

  await page.goto("/admin/notices");
  await expect(page).not.toHaveURL(/\/login/);
  // DB 미연결(CI)이면 목록 대신 로드 실패 안내가 나오므로 제목으로 진입만 확인
  await expect(page.getByRole("heading", { name: "공지사항" })).toBeVisible();
});
