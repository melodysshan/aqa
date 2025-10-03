import { test } from '@playwright/test';
import { getAccountByCriteria } from '../../utils/excelReader';
const { submissionScenario } = require('../funtion/submission_function.spec')

const testCases = [
  //
  {
    account_criteria: {dcp_access: 'GDR', role: 'user', env: 'local', upload_pwd: 'on'},
    dcp: {testID: 'Dropdown-item-gdr', expectedText: 'Granular Data Reporting (GDR)'},
    submissionType: { testID: 'Dropdown-item-submission', expectedText: 'Regular report'},
    dataArea: {testID: 'Dropdown-item-CL', expectedText: 'CL - Corporate Loans'},
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-1'},
    filePath: 'J:\\Projects\\CSP AQA\\csp-new-gen-aqa-main\\test_data\\999991\\1 zip - failed preview\\999991_20250131_CL.zip'
  },
  {
    account_criteria: {dcp_access: 'GDR', role: 'user', env: 'local', upload_pwd: 'on'},
    dcp: {testID: 'Dropdown-item-gdr', expectedText: 'Granular Data Reporting (GDR)'},
    submissionType: { testID: 'Dropdown-item-supplementary', expectedText: 'Supplementary file'},
    dataArea: {testID: 'Dropdown-item-DCTCL', expectedText: 'DCTCL - Data Constraint Tracker - Corporate Loans'},
    positionDate: {date: 'Choose Thursday, August 21st,'},
    filePath: 'J:\\Projects\\CSP AQA\\csp-new-gen-aqa-main\\test_data\\DCTCL.zip'
  }
];


test.describe('Submission Scenario', () => {
  for (const data of testCases){
    test(`${data.dcp.expectedText}, ${data.submissionType.expectedText}, ${data.dataArea.expectedText}`, async({page}) => {
      const account = await getAccountByCriteria(data.account_criteria);
      if (!account) throw new Error('No matching account found in Excel');
      account.otpassword = '000000';
      console.log(account)
      await submissionScenario(page, account, data.dcp, data.submissionType, data.dataArea, data.filePath);
    });
  }
});

//account: {username: 'testbulkimport103@demo.com.hk', password: 'Hkma@1488!2', otpassword: '000000'},