import { test } from '@playwright/test';
import { getAccounts } from '../utils/accountManager';
import { expand } from "../utils/mappingTestCase";
import { getFilesFromFolder } from '../utils/getFiles';
import { allure } from "allure-playwright";
const { submissionScenario } = require('./funtion/submission_function.spec')

const test_data_folder = 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data'

const rawCases = [
  //failed preliminary rules
  {
    testID: 'WebSubmission_3.4.0_Regression_001',
    testCase: 'failed preliminary rules',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "AML", submissionType: "Regular report", dataArea: "FCR",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-6'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Regular report\\FCR\\1 zip - failed prelim\\999993_20250630_FCR.zip'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_002',
    testCase: 'failed preliminary rules',
    account_criteria: {dcp_access: 'GDR', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "GDR", submissionType: "Regular report", dataArea: "CL",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-1'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\GDR\\Regular report\\CL\\1 zip - failed prelim\\999993_20250131_CL.zip'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_003',
    testCase: 'failed preliminary rules',
    account_criteria: {dcp_access: 'RPO', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "RPO", submissionType: "Regular report", dataArea: "SVFSTA",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-5'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\GDR\\Regular report\\CL\\1 zip - failed prelim\\SVFU005_20250531_SVFSTA.zip'
  },
  //passed preliminary rules - without upload password
  {
    testID: 'WebSubmission_3.4.0_Regression_007',
    testCase: 'passed preliminary rules - without upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'off'},
    dcp: "AML", submissionType: "Regular report", dataArea: "FCR",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-6'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Regular report\\FCR\\2 files - passed prelim\\999993_20250630_FCR.xlsx'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_008',
    testCase: 'passed preliminary rules - without upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'off'},
    dcp: "AML", submissionType: "Supplementary file", dataArea: "IRA",
    positionDate: {date: 'Choose Thursday, October 2nd,'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Supplementary file\\IRA\\2 files - passed prelim\\IRA.xlsx'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_009',
    testCase: 'passed preliminary rules - without upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'off'},
    dcp: "AML", submissionType: "Supplementary file", dataArea: "ONSITE",
    positionDate: {date: 'Choose Thursday, October 2nd,'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Supplementary file\\ONSITE\\2 files - passed prelim\\Filecloud - Notification Setting.pdf'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_010',
    testCase: 'passed preliminary rules - without upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'off'},
    dcp: "AML", submissionType: "Supplementary file", dataArea: "AMLOTH",
    positionDate: {date: 'Choose Thursday, October 2nd,'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Supplementary file\\AMLOTH\\2 files - passed prelim\\Operating procedures on customer due diligence.doc'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_015',
    testCase: 'passed preliminary rules - without upload password',
    account_criteria: {dcp_access: 'GDR', role: 'user', env: 'local', upload_pwd_status: 'off'},
    dcp: "GDR", submissionType: "Regular report", dataArea: "CL",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-1'},
    filePath: getFilesFromFolder('J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\GDR\\Regular report\\CL\\2 files - passed prelim', ['csv'])
  },

  //passed preliminary rules - with upload password
  {
    testID: 'WebSubmission_3.4.0_Regression_011',
    testCase: 'passed preliminary rules - with upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "AML", submissionType: "Regular report", dataArea: "FCR",
    positionDate: {year: 'Dropdown-item-2025', month: 'Dropdown-item-6'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Regular report\\FCR\\3 zip - passed prelim\\999991_20250630_FCR.zip'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_012',
    testCase: 'passed preliminary rules - with upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "AML", submissionType: "Supplementary file", dataArea: "IRA",
    positionDate: {date: 'Choose Thursday, October 2nd,'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Supplementary file\\IRA\\3 zip - passed prelim\\IRA.zip'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_013',
    testCase: 'passed preliminary rules - with upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "AML", submissionType: "Supplementary file", dataArea: "ONSITE",
    positionDate: {date: 'Choose Thursday, October 2nd,'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Supplementary file\\ONSITE\\3 zip - passed prelim\\Filecloud - Notification Setting.zip'
  },
  {
    testID: 'WebSubmission_3.4.0_Regression_014',
    testCase: 'passed preliminary rules - with upload password',
    account_criteria: {dcp_access: 'AML', role: 'user', env: 'local', upload_pwd_status: 'on'},
    dcp: "AML", submissionType: "Supplementary file", dataArea: "AMLOTH",
    positionDate: {date: 'Choose Thursday, October 2nd,'},
    filePath: 'J:\\Projects\\CSP-AQA\\csp-new-gen-aqa-main\\test_data\\AML\\Supplementary file\\AMLOTH\\3 zip - passed prelim\\Operating procedures on customer due diligence.zip'
  }
];

const testCases = expand(rawCases);

const filterTestIDs = ['WebSubmission_3.4.0_Regression_001'];
const filtered = testCases.filter(tc => filterTestIDs.length === 0 || filterTestIDs.includes(tc.testID));

test.describe('Submission', () => {
  for (const data of filtered){
    test(`${data.testID}: Create submission ${data.testCase} - ${data.dcp.shortName} - ${data.dataArea.shortName}`, async({page}) => {
      const account = await getAccounts(data.account_criteria);
      if (!account) throw new Error('No matching account found in Excel');
      account.otpassword = '000000';

      allure.label('testID', data.testID);
      allure.feature('Submission');
      allure.story(data.testCase);
      allure.parameter('DCP', data.dcp.expectedText);
      allure.parameter('Submission type', data.submissionType.expectedText);
      allure.parameter('Data area', data.dataArea.expectedText);
      allure.parameter('Entity', account.entity);
      allure.parameter('Username', account.username);
      
      test.setTimeout(300000);
      await submissionScenario(page, data.testID, account, data.dcp, data.submissionType, data.dataArea, data.positionDate, data.filePath, data.testCase);
    });
  }
});