//add Allure report
import { test, expect } from '@playwright/test';
import { allure } from "allure-playwright";
import fs from "fs";
import { takeStepScreenshot } from '../../utils/screenshotHelper';
import { setDatePicker } from '../../utils/datePicker';
const { login } = require('./login_function.spec');

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

async function checkSubmissionPage(page){
  const start = Date.now();
  await page.getByTestId('Navigation-ListItem-submission').getByTestId('Navigation-ListItem-Header').click();
  await expect(page.getByTestId('title')).toContainText('Submission Management');
  const end = Date.now();
  const duration = end - start;
  const shot_submission_page = await takeStepScreenshot(page, testID, 'successful-submission');
  console.log(`Navigation + loading took ${duration} ms`)
  return shot_submission_page
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
 
  //await page.getByTestId('NextBtn').click(); delete in CSP 3.4.0

  //position date
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
  await page.locator('#dataBlock').setInputFiles(file_path, { timeout: 60000 });
  await page.getByTestId('PreviewBtn').click();

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - main:
      - img
      - text: Input submission information
      - img
      - text: /Upload submission file 3 Preview submission information 4 Submit for preliminary validation check Entity code - Entity name.*DCP.*Submission type.*Data area.*(Position date|Report date).*Attachment\\(s\\)/
      - img
      - link /.*\.(zip|csv|xlsx)/
      - button "Back"
      - button "Submit"
    `, { timeout: 60000 });
  await page.waitForSelector('[data-testid="SubmitBtn"]', { visible: true, timeout: 60000 });
  await page.getByTestId('SubmitBtn').click();
  await page.locator('img[alt="loading spinner"]').waitFor({state: 'hidden', timeout:60000});
  console.log("Uploading file.");
}

async function failedPrelim(page, testID){
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - main:
      - heading "Failed preliminary rules check" [level=2]
      - table:
        - rowgroup:
          - 'row "Status: Incomplete"':
            - cell "Status:"
            - cell "Incomplete"
    `, {timeout: 150000});
  
  const shot_result = await takeStepScreenshot(page, testID, 'failed-prelim');
  return shot_result
}

async function recordSubmitted(page, testID){
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
  
  const shot_result = await takeStepScreenshot(page, testID, 'passed-prelim');
  await page.getByTestId('DoneBtn').click();

  //await Promise.race([
   //page.locator('table >> text=loading spinner').waitFor({state: 'hidden', timeout:60000}),
   //page.locator('table >> text=loading spinner').waitFor({state: 'detached', timeout:60000}),
   //page.locator('table >> img[alt="loading spinner"]').waitFor({state: 'hidden', timeout:60000})
  //]);
  //await expect(page.locator('img[alt="loading spinner"]')).toHaveCount(0,{timeout:60000});
  //await page.locator('table >> img[alt="loading spinner"]').waitFor({state: 'hidden', timeout:60000});
  

  //await page.getByTestId('backBtn').click();
  console.log("Checking the results.")
  return shot_result
}

async function checkRecords(page, target_position, dataArea, testID) {
  await page.getByTestId('Navigation-ListItem-submission').getByTestId('Navigation-ListItem-Header').click();

  await setDatePicker(page, 0, target_position.from);
  await setDatePicker(page, 1, target_position.to);

  await page.getByTestId('DATA_AREA').getByTestId('Dropdown-header').click();
  await page.getByTestId(dataArea.expectedText).click();

  const shot_record_overall = await takeStepScreenshot(page, testID, 'submission-status');
  return shot_record_overall
}

async function submissionManagement(page){
  await allure.step('Login', async() => await login(page, account));
  const evidence = await allure.step('Check submission', async() => await checkSubmissionPage(page));
  allure.attachment('Evidence', fs.readFileSync(evidence), 'image/png');
}

async function submissionScenario(page, testID, account, dcp, submissionType, dataArea, positionDate, file_path, testCase){
  await allure.step('Login', async() => await login(page, account));
  await allure.step('Create submission', async() => await createSubmission(page, dcp, submissionType, dataArea, positionDate));
  await allure.step('Uplaod file', async() => await uploadFile(page, file_path));
  if (testCase === 'passed preliminary rules - zip') {
    const evidence1 = await allure.step('Check results', async() => await recordSubmitted(page, testID));
    allure.attachment('Evidence1', fs.readFileSync(evidence1), 'image/png');
  } else if (testCase === 'failed preliminary rules') {
    const evidence1 = await allure.step('Check results', async() => await failedPrelim(page, testID));
    allure.attachment('Evidence1', fs.readFileSync(evidence1), 'image/png');
  } else {
    console.log(`No test case as ${testCase}.`)
  }
  //const evidence2 = await allure.step('Check submission records', async() => await checkRecords(page, target_position, dataArea, testID));
  //allure.attachment('Evidence2', fs.readFileSync(evidence2), 'image/png');
}



module.exports = {submissionManagement, submissionScenario};