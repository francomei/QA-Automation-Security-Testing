import { test, expect } from '@playwright/test';
import { JuiceShopLoginPage } from '../../src/pages/juiceShopLoginPage';

test('XSS - Search Alert', async ({ page }) => {

  const loginPage = new JuiceShopLoginPage(page);

  await loginPage.navigate();
  await loginPage.openLogin();

  await loginPage.login(
    process.env.TEST_USER_EMAIL!,
    process.env.TEST_USER_PASSWORD!
  );


  await page.locator('.search-area mat-icon').first().click();

  const searchInput = page.getByRole('textbox');

  await expect(searchInput).toBeVisible();

  const dialogPromise = page.waitForEvent('dialog', {
    timeout: 5000,
  });

  await searchInput.fill(
    '<iframe src="javascript:alert(`xss`)">'
  );
  await searchInput.press('Enter');

   const dialog = await dialogPromise;

  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toBe('xss');

  await dialog.dismiss();
});