import { expect, test, type Page } from "@playwright/test";

/** 렌더 중 브라우저 JS 예외가 나면 실패 처리 */
function trackPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test("홈이 열리고 주요 섹션이 보인다", async ({ page }) => {
  const errors = trackPageErrors(page);
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(400);
  await expect(page).toHaveTitle(/우리챔버오케스트라/);
  await expect(page.getByRole("heading", { name: "최근 공연" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "우리단원" })).toBeVisible();
  expect(errors).toEqual([]);
});

const boards = [
  { name: "공지사항", path: "/activities/notices" },
  { name: "보도자료", path: "/activities/press" },
  { name: "공연 활동", path: "/activities/performances" },
] as const;

for (const board of boards) {
  test.describe(board.name, () => {
    test("목록이 열린다", async ({ page }) => {
      const errors = trackPageErrors(page);
      const res = await page.goto(board.path);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("main")).toBeVisible();
      expect(errors).toEqual([]);
    });

    // 주의: 상세 진입 시 해당 글 view_count 가 +1 된다 (연결된 DB 기준)
    test("첫 글 상세로 진입한다", async ({ page }) => {
      const errors = trackPageErrors(page);
      await page.goto(board.path);
      // 정적 폴백 글(id: fallback-*)은 상세 페이지가 없으므로 제외
      const firstLink = page
        .locator(
          `main a[href^="${board.path}/"]:not([href*="/fallback-"])`,
        )
        .first();
      test.skip(
        (await firstLink.count()) === 0,
        "게시글 없음 또는 Supabase 미연결(정적 폴백) — 상세 진입 생략",
      );

      const href = (await firstLink.getAttribute("href"))!;
      // Link 클릭은 클라이언트 전환이라 404 상태를 못 잡으므로 직접 요청해 검사
      const res = await page.goto(href);
      expect(res?.status()).toBeLessThan(400);
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.locator("main h1, main h2").first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  });
}
