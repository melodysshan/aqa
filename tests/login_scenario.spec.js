import { test } from '@playwright/test';
import { getAccounts } from '../utils/accountManager';
const {pwdExpiredScenario} = require('./funtion/login_function.spec');

const testCases = {
    account_criteria: {dcp_access: 'Generic', upload_pwd: '/'}
}

test ('expired password update', async({browser}) => {
    test.setTimeout(300000);
    const accounts = await getAccounts(testCases.account_criteria, {multiple: true});
    if (!accounts || accounts.length === 0) throw new Error('No matching account found in Excel');

    console.log(`Found ${accounts.length} accounts:`);
    
    for (const account of accounts){
        const context = await browser.newContext();
        const page = await context.newPage();
        account.otpassword = '000000';
        await pwdExpiredScenario(page, account);
        await page.close();
        await context.close();
    }
})