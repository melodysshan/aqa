import { test, expect } from '@playwright/test';
async function login(page, account) {
  // login
  await page.goto('https://csp-uat.hkma.gov.hk/login');
  await page.getByTestId('username').fill(account.username);
  await page.getByTestId('password').click();
  await page.getByTestId('password').fill(account.password);
  await page.getByTestId('login').click();
  await page.getByTestId('otpassword').click();
  await page.getByTestId('otpassword').fill(account.otpassword);
  await page.getByTestId('submit').click();

  console.log("Logging in HKMA Portal.");
}

async function checkHomePage(page) {
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
    `, {timeout: 30000});
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Latest notifications" [level=3]
    - button "View all"
    `, {timeout: 30000});
  console.log("Checking home page in HKMA Portal.")
}


async function createSubmission(page, dcp, submissionType, dataArea, positionDate){
  //submission
  await page.getByTestId('Navigation-ListItem-submission').getByTestId('Navigation-ListItem-Header').click();
  await page.getByTestId('createBtn').click();

  //dcp
  await page.getByTestId('dcp').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId(dcp.testID)).toContainText(dcp.expectedText); //check the list
  await page.getByTestId(dcp.testID).click();
  
  //submission type
  await page.getByTestId('submissionType').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId(submissionType.testID)).toContainText(submissionType.expectedText); //check the list
  await page.getByTestId(submissionType.testID).click();

  //data area
  await page.getByTestId('dataArea').getByTestId('Dropdown-header').click();
  await expect(page.getByTestId(dataArea.testID)).toContainText(dataArea.expectedText); //check the list
  await page.getByTestId(dataArea.testID).click();

  await page.getByTestId('NextBtn').click();

  //position date
  const positionDateYearSelect = page.getByTestId('positionDate-year-select');
  const datePickerField = page.getByTestId('DatePickerField');
  try {
    await positionDateYearSelect.waitFor({state:'attached', timeout: 60000});
    console.log('Using Year Month Select')
    await page.getByTestId('positionDate-year-select').getByTestId('Dropdown-header').click();
    await page.getByTestId(positionDate.year).click();

    await page.getByTestId('positionDate-month-select').getByTestId('Dropdown-header').click();
    await page.getByTestId(positionDate.month).getByTestId('Typography').click();
  } catch (e) {
    console.log('Checking DatePickerField');
    await datePickerField.waitFor({state:'attached', timeout: 80000});
    console.log('Using Date Picker');
    await datePickerField(page, positionDate.date);
  }

  if (submissionType.testID.includes('submission')) {
    await page.getByTestId('positionDate-year-select').getByTestId('Dropdown-header').click();
    await page.getByTestId(positionDate.year).click();

    await page.getByTestId('positionDate-month-select').getByTestId('Dropdown-header').click();
    await page.getByTestId(positionDate.month).getByTestId('Typography').click();
  } else if (submissionType.testID.includes('supplementary')) {
    await page.getByRole('button', { name: 'expand date picker' }).click();
    await page.getByRole('option', { name: positionDate.date}).click();

  } else {
    console.log('The reporting date is wrong.');
  }

  //resubmission application
  try {
    const modal = await page.getByTestId('Modal');
    const text = await modal.innerText({timeout: 60000})

    if (text.includes('Do you want to perform a resubmission?')) {
      await page.getByTestId('Modal-primaryCta').click();
    } 
  } catch (e) {
    console.log('The resubmission modal is not present.');
  }
  
  console.log("Creating submission.");
}

async function uploadFile(page, file_path){
  //console.log('isClosed?', page.isClosed());
  //upload file
  await page.locator('#dataBlock').setInputFiles(file_path, { timeout: 60000 });
  await page.getByTestId('PreviewBtn').click();

  console.log("Uploading file.");
}

async function checkResults(page){
  //confirm to upload the correct zip file
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - main:
      - img
      - text: Input submission information
      - img
      - text: /Upload submission file 3 Preview submission information 4 Submit for preliminary validation check Entity code - Entity name.*DCP.*Submission type.*Data area.*(Position date|Report date).*Attachment\\(s\\)/
      - img
      - link /.*\.zip/
      - button "Back"
      - button "Submit"
    `, { timeout: 60000 });
  await page.waitForSelector('[data-testid="SubmitBtn"]', { visible: true, timeout: 60000 });
  await page.getByTestId('SubmitBtn').click();

  await page.locator('img[alt="loading spinner"]').waitFor({state: 'hidden', timeout:60000});
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - main:
      - heading "Record submitted" [level=2]
      - table:
        - rowgroup:
          - 'row "Status: In progress"':
            - cell "Status:"
            - cell "In progress"
          - 'row /Reference ID: .*/':
            - cell "Reference ID:"
            - cell /.*/
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
  console.log("Checking the results.")
}

async function submissionScenario(page, account, dcp, submissionType, dataArea, positionDate, file_path){
  test.setTimeout(300000);
  await login(page, account);
  //await checkHomePage(page); announcement & notification
  await createSubmission(page, dcp, submissionType, dataArea, positionDate);
  await uploadFile(page, file_path);
  await checkResults(page);
}

module.exports = {submissionScenario};