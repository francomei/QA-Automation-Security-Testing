import { test, expect } from "@playwright/test";
import { JuiceShopLoginPage } from "../../src/pages/juiceShopLoginPage";

test("TC-003 - Buscar un producto", async ({ page }) => {
  const loginPage = new JuiceShopLoginPage(page);
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;

  const search = page.getByPlaceholder("Search");

  await loginPage.navigate();
  await loginPage.openLogin();
  await loginPage.login(email, password);

  await page.locator("#searchQuery").click();
  await page.getByRole("textbox").fill("Apple");
  await page.getByRole("textbox").press("Enter");

  await expect(page.getByText("Apple").first()).toBeVisible();
});

test("TC-004 - Agregar producto al carrito", async ({ page }) => {
  const loginPage = new JuiceShopLoginPage(page);
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;

  await loginPage.navigate();
  await loginPage.openLogin();
  await loginPage.login(email, password);

  // Open search
  await page.locator("#searchQuery").click();

  const searchInput = page.getByRole("textbox");

  await expect(searchInput).toBeVisible();
  await searchInput.fill("Apple");
  await searchInput.press("Enter");

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

  // Open basket
  await page.getByRole("button", { name: /Show the shopping cart/i }).click();

  // Verify product
  await expect(page.getByText(/Apple/i).first()).toBeVisible();
});
