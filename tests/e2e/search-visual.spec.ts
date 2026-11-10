import { test, expect } from "@playwright/test";

test.describe("Search page visual QA", () => {
  test("desktop screenshot", async ({ page }) => {
    await page.goto("/find", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(
      page.locator("h1").filter({ hasText: "Animal-care providers near you" })
    ).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
    await expect(page.locator('select[name="service"]')).toBeVisible();
    await expect(page.locator('select[name="animal"]')).toBeVisible();

    await page.screenshot({
      path: "tests/screenshots/search-desktop.png",
      fullPage: true,
    });
  });

  test("mobile screenshot", async ({ page }) => {
    await page.goto("/find", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(
      page.locator("h1").filter({ hasText: "Animal-care providers near you" })
    ).toBeVisible();
    await page.screenshot({
      path: "tests/screenshots/search-mobile.png",
      fullPage: true,
    });
  });

  test("URL parameter support", async ({ page }) => {
    await page.goto("/find?city=Bengaluru&type=veterinary&species=Dog", {
      waitUntil: "load",
    });
    await page.waitForTimeout(2000);

    await expect(page.locator('input[name="location"]')).toHaveValue("Bengaluru");
    await expect(page.locator('select[name="service"]')).toHaveValue("veterinary");
    await expect(page.locator('select[name="animal"]')).toHaveValue("Dog");
  });

  test("provider cards link to detail pages", async ({ page }) => {
    await page.goto("/find", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    const firstCard = page.locator('a[href^="/providers/"]').first();
    await expect(firstCard).toHaveAttribute("href", /^\/providers\//);
  });

  test("empty state shows", async ({ page }) => {
    await page.goto("/find?city=NonExistentCity", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(page.getByText("No providers found.")).toBeVisible();
  });

  test("result count displays", async ({ page }) => {
    await page.goto("/find?city=Bengaluru", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(
      page
        .locator('span:has-text("sample providers found")')
        .first()
    ).toBeVisible();
  });
});
