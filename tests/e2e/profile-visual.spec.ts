import { test, expect } from "@playwright/test";

test.describe("Provider profile visual QA", () => {
  test("desktop screenshot - Cedar & Clover Veterinary", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(
      page.locator("h1").filter({ hasText: "Cedar & Clover Veterinary" })
    ).toBeVisible();
    // Sample listing badge on the main hero image (first occurrence)
    await expect(
      page
        .locator('span[data-slot="badge"]:has-text("Sample listing")')
        .first()
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /call/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /email/i })).toBeVisible();
    // Directions link appears in hero panel + sidebar; check first occurrence
    await expect(
      page.locator('a[href*="google.com/maps"]').first()
    ).toBeVisible();

    await page.screenshot({
      path: "tests/screenshots/profile-desktop.png",
      fullPage: true,
    });
  });

  test("mobile screenshot", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(
      page.locator("h1").filter({ hasText: "Cedar & Clover Veterinary" })
    ).toBeVisible();
    await page.screenshot({
      path: "tests/screenshots/profile-mobile.png",
      fullPage: true,
    });
  });

  test("contact links are functional", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    // Phone link should be tel:
    const phoneLink = page.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute("href", /^tel:/);

    // Email link should be mailto:
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", /^mailto:/);

    // Directions link should be Google Maps (first occurrence in hero panel)
    const directionsLink = page.locator('a[href*="google.com/maps"]').first();
    await expect(directionsLink).toBeVisible();
  });

  test("breadcrumb navigation works", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    // Breadcrumb nav links (specific to the breadcrumb section)
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Find care" })).toBeVisible();
    await expect(
      breadcrumb.getByRole("link", { name: "Veterinary care" })
    ).toBeVisible();
  });

  test("not found for missing provider", async ({ page }) => {
    await page.goto("/providers/non-existent-provider", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    // Next.js 404 page shows "This path does not lead anywhere"
    await expect(page.locator("h1")).toContainText("This path does not lead anywhere");
  });

  test("related providers section", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(page.getByText("Keep exploring")).toBeVisible();
    // Related provider cards have links to /providers/[slug]
    await expect(
      page.locator('a[href^="/providers/"]').first()
    ).toBeVisible();
  });

  test("services offered section", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(page.getByText("Services offered")).toBeVisible();
    await expect(page.getByText("Preventive check-ups")).toBeVisible();
  });

  test("species handled section", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(page.getByText("Species handled")).toBeVisible();
    // Species are displayed as "Dog, Cat, Rabbit" so use contains matcher
    await expect(page.getByText("Dog, Cat, Rabbit")).toBeVisible();
  });

  test("correction link", async ({ page }) => {
    await page.goto("/providers/cedar-clover-veterinary", { waitUntil: "load" });
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole("link", { name: /Correct this listing/ })
    ).toHaveAttribute("href", "/submit-correction?provider=cedar-clover-veterinary");
  });
});
