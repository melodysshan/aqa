import { test, expect } from '@playwright/test';
const config = require( '../../config.json' );

test('test', async ({ page }) => {
  
  const file_path = config.testing_file_path;
  await page.setDefaultTimeout(300000);

  // login
  await page.goto('https://csp-uat.hkma.gov.hk/login');
  await page.getByTestId('username').fill('testbulkimport103@demo.com.hk');
  await page.getByTestId('password').click();
  await page.getByTestId('password').fill('Hkma@1488!2');
  await page.getByTestId('login').click();
  await page.getByTestId('otpassword').click();
  await page.getByTestId('otpassword').fill('000000');
  await page.getByTestId('submit').click();
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - text: CSP Home
    - img
    - text: Submission Management
    - img
    - text: Enquiry Management
    - img
    - text: Useful Information
    `, {timeout: 30000});
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Latest announcements" [level=3]
    - button "View all"
    `,{timeout: 30000});
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Latest notifications" [level=3]
    - button "View all"
    `);
  
  //submission
  await page.getByTestId('Navigation-ListItem-submission').getByTestId('Navigation-ListItem-Header').click();
  await page.getByTestId('createBtn').click();

  //dcp
  await page.getByTestId('dcp').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId('Dropdown-item-gdr')).toContainText('Granular Data Reporting (GDR)'); //check the list
  await page.getByTestId('Dropdown-item-gdr').click();
  
  //submission type
  await page.getByTestId('submissionType').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId('Dropdown-item-submission')).toContainText('Regular report'); //check the list
  await page.getByTestId('Dropdown-item-submission').click();

  //data area
  await page.getByTestId('dataArea').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId('Dropdown-item-CL')).toContainText('CL - Corporate Loans'); //check the list
  await page.getByTestId('Dropdown-item-CL').click();

  await page.getByTestId('NextBtn').click();

  //position date
  await page.getByTestId('positionDate-year-select').getByTestId('Dropdown-header').click();
  await page.getByTestId('Dropdown-item-2025').click();

  await page.getByTestId('positionDate-month-select').getByTestId('Dropdown-header').click();
  await page.getByTestId('Dropdown-item-1').getByTestId('Typography').click();

  //resubmission application
  const modalHeader = await page.getByTestId('Modal').innerText();
  if (modalHeader.includes('Do you want to perform a resubmission?')) {
    await expect(page.getByTestId('Modal')).toMatchAriaSnapshot(`
      - heading "Do you want to perform a resubmission?" [level=2]
      - text: /Please note the current submission record will become Inactive, 
      and the resubmission record will become the Active record for "CL" on position date "\\d+-\\d+-\\d+"\\./
      - button "Apply"
      - button "Cancel"
    `);
    await page.getByTestId('Modal-primaryCta').click();
  } else {
    console.log('The resubmission modal is not present.');
  }

  //upload file
  //await page.getByText('Drag and drop file(s) to upload, orBrowse').click();
  const fileInputSelector = '#dataBlock';
  await page.locator(fileInputSelector).setInputFiles(file_path);

  await page.getByTestId('PreviewBtn').click();
  //confirm to upload the correct zip file
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: Input submission information
    - img
    - text: /Upload submission file 3 Preview submission information 4 Submit for preliminary validation check Entity code - Entity name \\d+ - Test Bank \\d+ DCP Granular Data Reporting \\(GDR\\) Submission type Regular report Data area CL - Corporate Loans Position date \\d+-\\d+-\\d+ Attachment\\(s\\)/
    - img
    - link "999991_20250131_CL.zip"
    - button "Back"
    - button "Submit"
    `);
  await page.getByTestId('SubmitBtn').click();

  //Wait for the upload to start
  //await page.waitForSelector('img[alt="loading spinner"]', { timeout: 150000 });
  await page.locator('img[alt="loading spinner"]').waitFor({state: 'hidden', timeout:60000});
  //await page.waitForSelector('role=heading[name="Record submitted"]', { timeout: 150000 });
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Record submitted" [level=2]
    - table:
      - rowgroup:
        - 'row "Status: In progress"':
          - cell "Status:"
          - cell "In progress"
        - 'row /Reference ID: \\d+/':
          - cell "Reference ID:"
          - cell /\\d+/
        - 'row "Validation messages: The system is now performing further preliminary rules and validation checking. Please wait for the validation result within the submission details page."':
          - cell "Validation messages:"
          - cell "The system is now performing further preliminary rules and validation checking. Please wait for the validation result within the submission details page."
    `, {timeout: 150000});
  await page.getByTestId('DoneBtn').click();

  //await Promise.race([
   //page.locator('table >> text=loading spinner').waitFor({state: 'hidden', timeout:60000}),
   //page.locator('table >> text=loading spinner').waitFor({state: 'detached', timeout:60000}),
   //page.locator('table >> img[alt="loading spinner"]').waitFor({state: 'hidden', timeout:60000})
  //]);
  //await expect(page.locator('img[alt="loading spinner"]')).toHaveCount(0,{timeout:60000});
  //await page.locator('table >> img[alt="loading spinner"]').waitFor({state: 'hidden', timeout:60000});
  
  
  
  //screenshot
  await page.screenshot({
    path: 'screenshots/01.png',
    fullPage: true
  });
  await page.getByTestId('backBtn').click();
});