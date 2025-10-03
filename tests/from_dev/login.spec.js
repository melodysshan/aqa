const { test, expect } = require('@playwright/test');

test('login with random credentials', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('testbulkimport88@demo.com.hk');
  await page.getByTestId('password').fill('P@ssw0rd7');
  await page.getByTestId('login').click();
  await page.getByTestId('otpassword').fill('000000');
  await page.getByTestId('submit').click();
  await expect(page.getByTestId('Title-heading')).toContainText('Common Submission Platform');
  await expect(page.getByTestId('Title-desc')).toContainText('Welcome to');
}); 