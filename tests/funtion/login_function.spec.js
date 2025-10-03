import { test, expect } from '@playwright/test';
import {generateNewPassword, updateAccountPasswordInExcel} from '../../utils/accountManager';
import {config} from '../../config.json' assert {type:'json'};

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

async function checkPasswordExpired(page) {
  const expired = page.waitForSelector('text=Password expired', { timeout: 10000 }).then(() => true);
  const dashbaord = page.waitForSelector('text=CSP Home', { timeout: 10000 }).then(() => false);

  return Promise.race([expired, dashbaord]);
}

async function pwdExpired(page, account) {
    //pwd expired
    const expired = await checkPasswordExpired(page);
    if (expired) {
        console.log(`Password expired for ${account.username}`);

        const newPwd = generateNewPassword(account.password);

        await page.getByTestId('password').fill(account.password);
        await page.getByTestId('newPassword').fill(newPwd);
        await page.getByTestId('confirmedPassword').fill(newPwd);
        await page.getByTestId('submit').click();
        await expect(page.getByText('Password updated')).toBeVisible({timeout: 10000});
        await page.getByTestId('back').click();

        await updateAccountPasswordInExcel(account, newPwd);
        console.log(`Password updated for ${account.username}`);
    } else {
      console.log(`Password OK for ${account.username}`);
    }
}

async function pwdExpiredScenario(page, account){
    await login(page, account);
    await pwdExpired(page, account);
}

module.exports = {login, pwdExpiredScenario};