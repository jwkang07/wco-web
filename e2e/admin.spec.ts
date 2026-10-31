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
 * 로그인 후 목록 진입 — 테스트 전용 계정을 env 로 줄 때만 실행.
 * E2E_ADMIN_USERNAME / E2E_ADMIN_PASSWORD (운영 비밀번호를 저장소에 두지 말 것)
 */
const adminUser = process.env.E2E_ADMIN_USERNAME;
const adminPass = process.env.E2E_ADMIN_PASSWORD;

test("로그인 후 공지 목록에 진입한다", async ({ page }) => {
  test.skip(!adminUser || !adminPass, "E2E_ADMIN_USERNAME/PASSWORD 미설정");

  await page.goto("/admin");
  await page.locator("#username").fill(adminUser!);
  await page.locator("#password").fill(adminPass!);
  await page.locator('button[type="submit"]').click();
  await expect(page).not.toHaveURL(/\/login/);

  await page.goto("/admin/notices");
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.locator("table")).toBeVisible();
});
