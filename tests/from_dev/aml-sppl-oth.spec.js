const { test, expect } = require('@playwright/test');
const { dragAndDropFile } = require('../../utils/from_dev/drag_n_drop');

test('AMLOTH - Supplementary file', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('testbulkimport88@demo.com.hk');
  await page.getByTestId('password').fill('P@ssw0rd7');
  await page.getByTestId('login').click();
  await page.getByTestId('otpassword').fill('000000');
  await page.getByTestId('submit').click();

  // Assert landing page elements
  await expect(page.getByTestId('Title-heading')).toContainText('Common Submission Platform');
  await expect(page.getByTestId('Title-desc')).toContainText('Welcome to');

  // Assert left menu items
  await page.getByTestId('Navigation-ListItem-submission').getByTestId('Navigation-ListItem-Header').locator('div').click();

  await expect(page.getByTestId('createBtn')).toMatchAriaSnapshot(`- button "Create submission"`);
  await page.getByTestId('createBtn').click();
  await expect(page.getByTestId('dcp').getByTestId('Dropdown-header')).toMatchAriaSnapshot(`
    - text: Select DCP
    - img
    `);
  await page.getByTestId('dcp').click();
  await page.getByTestId('Dropdown-item-aml').getByTestId('Typography').click();
  await expect(page.getByTestId('dcp').getByTestId('Dropdown-header')).toMatchAriaSnapshot(`
    - text: Anti-Money Laundering (AML)
    - img
    `);
  await page.locator('.overflow-auto.flex-grow-1.flex-basis-0').click();

  await expect(page.getByTestId('submissionType').getByTestId('Dropdown-header')).toMatchAriaSnapshot(`
      - text: Select submission type
      - img
      `);

  await expect(page.getByTestId('submissionType').getByTestId('Dropdown-header')).toMatchAriaSnapshot(`
        - text: Select submission type
        - img
        `);
  await page.getByTestId('submissionType').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId('Dropdown-item-supplementary').getByTestId('Typography')).toMatchAriaSnapshot(`- text: Supplementary file`);
  await page.getByTestId('Dropdown-item-supplementary').getByTestId('Typography').click();
  await expect(page.getByTestId('dataArea').getByTestId('Dropdown-header')).toMatchAriaSnapshot(`- text: Select data area`);
  await page.getByTestId('dataArea').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId('Dropdown-item-AMLOTH')).toMatchAriaSnapshot(`- text: AMLOTH - Other files`);
  await page.getByTestId('Dropdown-item-AMLOTH').getByTestId('Typography').click();
  await expect(page.getByTestId('NextBtn')).toMatchAriaSnapshot(`- button "Next"`);
  await page.getByTestId('NextBtn').click();
  await expect(page.getByLabel('expand date picker')).toMatchAriaSnapshot(`
      - button "expand date picker":
        - img
      `);
  await page.getByRole('button', { name: 'expand date picker' }).click();
  await page.getByRole('option', { name: 'Choose Monday, June 30th, 2025' }).click();
  await page.getByRole('button', { name: 'expand date picker' }).click();
  await expect(page.getByTestId('DatePicker-day-17')).toMatchAriaSnapshot(`- text: /\\d+/`);
  await page.getByTestId('DatePicker-day-17').click();
  await page.locator('.row').click();
  await expect(page.getByTestId('dataBlock').locator('label')).toMatchAriaSnapshot(`
      - img
      - text: Drag and drop file(s) to upload, or
      - button "Browse"
      `);


  await expect(page.getByTestId('dataBlock').locator('label')).toMatchAriaSnapshot(`
        - img
        - text: Drag and drop file(s) to upload, or
        - button "Browse"
        `);

  await page.waitForTimeout(3000);
  await dragAndDropFile(
    page,
    "#dataBlock",
    'C:/Users/admin/Desktop/repository/csp-new-gen-aqa/mock-data/amloth.zip',
    'amloth.zip',
    'application/zip'
  );
  await page.getByTestId('PreviewBtn').click();
  await expect(page.getByTestId('ProgressTracker-step-item-1').locator('div').nth(2)).toBeVisible();
  await expect(page.getByTestId('dataBlock')).toBeVisible();
  await expect(page.getByTestId('SubmitBtn')).toMatchAriaSnapshot(`- button "Submit"`);
  await page.getByTestId('SubmitBtn').click();
  await expect(page.getByAltText('Record submitted')).toBeVisible();
  await expect(page.getByTestId('StateComponent-title')).toContainText('Record submitted');
  await expect(page.getByRole('rowgroup')).toContainText('The system is now performing further preliminary rules and validation checking.Please wait for the validation result within the submission details page.');
  await expect(page.getByTestId('DoneBtn')).toBeVisible();
  await expect(page.getByTestId('DoneBtn')).toMatchAriaSnapshot(`- button "Done"`);
  await page.getByTestId('DoneBtn').click();
  await expect(page.getByTestId('th-refId').locator('span')).toContainText('Reference ID');
  await page.getByTestId('Navigation-ListItem-home').getByTestId('Navigation-ListItem-Header').locator('div').click();
}); 