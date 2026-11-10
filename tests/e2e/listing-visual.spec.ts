import { test, expect } from "@playwright/test";

test.describe("Business listing page visual QA", () => {
  test.use({ navigationTimeout: 60000 });

  test("desktop screenshot - listing page", async ({ page }) => {
    await page.goto("/list-business", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    await expect(
      page.locator("h1").filter({ hasText: "Make your animal-care services easier to find" })
    ).toBeVisible();
    await expect(
      page.locator('a[href="#business-form"]').getByText("List Your Business")
    ).toBeVisible();

    await page.screenshot({
      path: "tests/screenshots/listing-desktop.png",
      fullPage: true,
    });
  });

  test("mobile screenshot", async ({ page }) => {
    await page.goto("/list-business", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    await expect(
      page.locator("h1").filter({ hasText: "Make your animal-care services easier to find" })
    ).toBeVisible();
    await page.screenshot({
      path: "tests/screenshots/listing-mobile.png",
      fullPage: true,
    });
  });

  test("form navigation between steps", async ({ page }) => {
    await page.goto("/list-business", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Click the List Your Business button to scroll to form
    await page.click('a[href="#business-form"]');
    await page.waitForTimeout(1000);

    // Check step 1 is visible (use h2 heading selector)
    await expect(page.locator("h2").filter({ hasText: "Business information" })).toBeVisible();

    // Fill in step 1
    await page.fill('input#business-name', "Test Clinic");
    await page.selectOption('select[name="category"]', "veterinary");
    await page.fill('textarea[name="description"]', "A test veterinary clinic providing quality care.");
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Check step 2 is visible
    await expect(page.locator("h2").filter({ hasText: "Services & animals" })).toBeVisible();

    // Select some services and animals
    await page.click('label:has-text("General Consultation")');
    await page.click('label:has-text("Dogs")');
    await page.click('label:has-text("Cats")');

    // Click Continue to go to step 3
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    // Check step 3 is visible
    await expect(page.locator("h2").filter({ hasText: "Location" })).toBeVisible();

    // Fill location
    await page.fill('input#address-line-1', "123 Test Street");
    await page.selectOption('select[name="city"]', "Bengaluru");
    await page.fill('input[name="postalCode"]', "560038");

    // Click Continue to go to step 4
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    // Check step 4 is visible
    await expect(page.locator("h2").filter({ hasText: "Contact information" })).toBeVisible();

    // Fill contact
    await page.fill('input[name="phone"]', "+91 80 5550 0100");
    await page.fill('input[name="email"]', "test@clinic.example");

    // Click Continue to go to step 5
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    // Check step 5 is visible
    await expect(page.locator("h2").filter({ hasText: "Business details" })).toBeVisible();

    // Click Continue to go to step 6
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    // Check step 6 is visible
    await expect(page.locator("h2").filter({ hasText: "Review & submit" })).toBeVisible();
    await expect(page.getByText("Test Clinic")).toBeVisible();
  });

  test("form submission success", async ({ page }) => {
    await page.goto("/list-business", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Click List Your Business
    await page.click('a[href="#business-form"]');
    await page.waitForTimeout(1000);

    // Fill all steps quickly
    // Step 1
    await page.fill('input#business-name', "Test Clinic");
    await page.selectOption('select[name="category"]', "veterinary");
    await page.fill('textarea[name="description"]', "A test veterinary clinic.");
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 2
    await page.click('label:has-text("General Consultation")');
    await page.click('label:has-text("Dogs")');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 3
    await page.fill('input#address-line-1', "123 Test Street");
    await page.selectOption('select[name="city"]', "Bengaluru");
    await page.fill('input[name="postalCode"]', "560038");
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 4
    await page.fill('input[name="phone"]', "+91 80 5550 0100");
    await page.fill('input[name="email"]', "test@clinic.example");
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 5 - skip (just continue)
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 6 - Review - check consent
    await page.check('input[type="checkbox"][name="consent"]');
    await page.waitForTimeout(500);

    // Submit
    await page.click('button:has-text("Submit business listing")');
    await page.waitForTimeout(3000);

    // Check success page
    await expect(page.getByText("Listing submitted.")).toBeVisible();
    await expect(page.getByText("Reference")).toBeVisible();
  });

  test("validation errors show on submit", async ({ page }) => {
    await page.goto("/list-business", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // Click List Your Business
    await page.click('a[href="#business-form"]');
    await page.waitForTimeout(1000);

    // Skip through all steps without filling anything
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(500);
    }

    // On step 6, try to submit without consent
    await page.click('button:has-text("Submit business listing")');
    await page.waitForTimeout(1000);

    // Should show server error about consent
    await expect(page.getByText("Please check the highlighted fields and try again.")).toBeVisible();
  });
});
