import { test, expect } from "@playwright/test";
import { JuiceShopLoginPage } from "../../src/pages/juiceShopLoginPage";

test("TC-005 - Completar checkout", async ({ page }) => {
  const loginPage = new JuiceShopLoginPage(page);
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;

  const search = page.getByPlaceholder("Search");

  await loginPage.navigate();
  await loginPage.openLogin();
  await loginPage.login(email, password);

  // Find product and add to basket
  await page.locator("#searchQuery").click();
  await page.getByRole("textbox").fill("Apple");
  await page.getByRole("textbox").press("Enter");

  await expect(page.getByText("Apple").first()).toBeVisible();
  // Select first available Apple product
  const availableProduct = page
    .locator("mat-card")
    .filter({ hasText: "Apple" })
    .filter({ hasNotText: "Sold Out" })
    .first();

  await expect(availableProduct).toBeVisible();

  // Add product to basket
  const addToBasket = availableProduct.getByRole("button", {
    name: "Add to Basket",
  });

  await expect(addToBasket).toBeVisible();
  await addToBasket.click();

  await page
  .getByRole("button", { name: /Show the shopping cart/i })
  .click();

await expect(page.getByText(/Apple/i).first()).toBeVisible();

const checkoutButton = page.locator("#checkoutButton");

await expect(checkoutButton).toBeVisible();
await expect(checkoutButton).toBeEnabled();

await checkoutButton.click();

const dismissCookies = page.getByRole("button", {
  name: "Dismiss cookie message",
});

if (await dismissCookies.isVisible()) {
  await dismissCookies.click();
}


  // Fill in address details
  await page.getByRole("button", { name: /Add a new address/i }).click();

  await page.getByPlaceholder("Country").fill("United States");
  await page.getByPlaceholder("Name").fill("John Doe");
  await page.getByPlaceholder("Mobile Number").fill("1234567890");
  await page.getByPlaceholder("Zip Code").fill("12345");
  await page.getByPlaceholder("Address").fill("123 Main Street");
  await page.getByPlaceholder("City").fill("New York");

  await page.waitForTimeout(3000);

  await page.locator("#submitButton").click();

  // Select address
  await page.getByRole("radio").first().check();
  await page.waitForTimeout(3000);

  await page
    .getByRole("button", { name: /Proceed to payment selection/i })
    .click();

  // Select delivery method
  await page.getByRole("row", { name: /Fast Delivery/i }).click();

  await page
    .getByRole("button", { name: /Proceed to delivery method selection/i })
    .click();

  await page.locator("#mat-expansion-panel-header-0").click();

  // Fill in payment details
  await page.getByText("Name").fill("John Doe");
  await page.getByText("Card Number").fill("2222333344445555");

  const month = page.getByRole("combobox", { name: /Expiry Month/i });
  await month.click();
  await month.press("ArrowDown");
  await month.press("Enter");

  const year = page.getByRole("combobox", { name: /Expiry Year/i });
  await year.click();
  await year.press("ArrowDown");
  await year.press("ArrowDown");
  await year.press("ArrowDown");
  await year.press("Enter");

  await page.locator("#submitButton").click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: /Proceed to review/i }).click();

  await page.getByRole("button", { name: /Complete your purchase/i }).click();

  await page.getByText("Thank you for your purchase!").waitFor();
});
