import { test, expect } from "@playwright/test";
import { JuiceShopLoginPage } from "../../src/pages/juiceShopLoginPage";

test("DOM-XSS - Search Alert", async ({ page }) => {
  let xssTriggered = false;

  page.on("dialog", async (dialog) => {
    xssTriggered = true;
    await dialog.dismiss();
  });
  
  const loginPage = new JuiceShopLoginPage(page);

  // Login
  await loginPage.navigate();
  await loginPage.openLogin();

  await loginPage.login(
    process.env.TEST_USER_EMAIL!,
    process.env.TEST_USER_PASSWORD!,
  );

  await page.locator(".search-area mat-icon").first().click();

  const searchInput = page.getByRole("textbox");

  await searchInput.fill('<iframe src="javascript:alert(`xss`)">');
  await searchInput.press("Enter");

  await page.waitForTimeout(1000);

  await expect.poll(() => xssTriggered, { timeout: 5000 }).toBe(true);
});
