import { test, beforeAll, afterAll, chromium } from '@playwright/test';
const { submissionScenario } = require('../funtion/submission_function.spec')

test.describe('Submission Scenario', () => {
  test('GDR, Regular report, CL', async({page}) => {
    await submissionScenario(page, 'Dropdown-item-submission', 'Regular report', 'Dropdown-item-CL', 'CL - Corporate Loans',
      "J:\\Projects\\CSP AQA\\csp-new-gen-aqa-main\\test_data\\999991\\1 zip - failed preview\\999991_20250131_CL.zip");
  });

  test('GDR, Supplementary file, DCTCL', async ({page}) => {
    await submissionScenario(page, 'Dropdown-item-supplementary', 'Supplementary file', 'Dropdown-item-DCTCL', 'DCTCL - Data Constraint Tracker - Corporate Loans',
      "J:\\Projects\\CSP AQA\\csp-new-gen-aqa-main\\test_data\\DCTCL.zip");
  });
});
