import { test } from '@playwright/test';
import { getAccounts } from '../utils/accountManager';
import { expand } from "../utils/mappingTestCase";
import { allure } from "allure-playwright";
const { submissionScenario } = require('./funtion/submission_function.spec')


const test_folder = "J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\GDR\\Regular report\\CL\\2 files - successful prelim\\"

const rawCases = [
  {
    testID: 'CSP_3.3.2_UAT_004',
    account_criteria: {dcp_access: 'GDR', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "GDR", submissionType: "Regular report", dataArea: "CL",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-1'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\GDR\\Regular report\\CL\\1 zip - successful prelim\\999991_20250131_CL.zip'
  },
  {
    testID: 'Submission-002',
    account_criteria: {dcp_access: 'GDR', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "GDR", submissionType: "Supplementary file", dataArea: "DCTCL",
    positionDate: {date: 'Choose Monday, September 1st,'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\GDR\\Supplementary file\\DCTCL\\DCTCL - Data Constraint Tracker - Corporate Loans 1.zip'
  },
  {
    testID: 'Submission-003',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "AML", submissionType: "Regular report", dataArea: "FCR",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-6'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Regular report\\FCR\\1 zip - successful preview\\999991_20250630_FCR.zip'
  },
  {
    testID: 'Submission-004',
    account_criteria: {dcp_access: 'GDR', role: 'user', env: 'local', upload_pwd_status: 'off'},
    dcp: "GDR", submissionType: "Regular report", dataArea: "CL",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-1'},
    filePath: [ test_folder + '999993_20250131_CL_CLL.csv',
                test_folder + '999993_20250131_CL_DLI.csv',
                test_folder + '999993_20250131_CL_EIS.csv',
                test_folder + '999993_20250131_CL_IRI.csv',
                test_folder + '999993_20250131_CL_LPL.csv',
                test_folder + '999993_20250131_CL_PD.csv',
                test_folder + '999993_20250131_CL_PS.csv',
                test_folder + '999993_20250131_CL_RB.csv',
                test_folder + '999993_20250131_CL_SLI.csv']
  }
];

const testCases = expand(rawCases);

test.describe('Submission Management @regression_3.3.2', () => {
  const filterTestIDs = ['Submission-004','Submission-003'];
  const filtered = testCases.filter(tc => filterTestIDs.length === 0 || filterTestIDs.includes(tc.testID));
  
  for (const data of filtered){
    test(`${data.testID}: ${data.dcp.expectedText}, ${data.submissionType.expectedText}, ${data.dataArea.expectedText}, ${data.account_criteria.upload_pwd_status}`, async({page}) => {
      const account = await getAccounts(data.account_criteria);
      if (!account) throw new Error('No matching account found in Excel');
      account.otpassword = '000000';

      allure.label('testID', data.testID);
      allure.feature('Submission');
      allure.story('Valid submission');
      allure.story(data.dcp.expectedText);
      allure.parameter('DCP', data.dcp.expectedText);
      allure.parameter('Submission type', data.submissionType.expectedText);
      allure.parameter('Data area', data.dataArea.expectedText);
      allure.parameter('Account', `${data.account_criteria}, ${account.username}`);
      
      test.setTimeout(300000);
      await submissionScenario(page, data.testID, account, data.dcp, data.submissionType, data.dataArea, data.positionDate, data.filePath);
    });
  }
});