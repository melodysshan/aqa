import ExcelJS from 'exceljs';
import config from '../config.json'

interface Account {
  dcp_access: string;
  role: string;
  env: string;
  entity: string;
  upload_pwd_status: string;
  upload_pwd: string;
  username: string;
  password: string;
}

/**
 * read accounts
 * @param criteria 
 * @param options { multiple: true=array，false=the first match }
 */

export async function getAccounts(
  criteria: Partial<Account>,
  options: { multiple?: boolean } = {}
): Promise<Account[] | Account | null> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(config.testing_account_path);
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) throw new Error('Worksheet not found!');

  // read the header
  const headerMap: Record<string, number> = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cell.text.trim()] = colNumber;
  });

  const results: Account[] = [];

  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    // get the value through header
    const account: Account = {
      dcp_access: row.getCell(headerMap['dcp_access']).text,
      role: row.getCell(headerMap['role']).text,
      env: row.getCell(headerMap['env']).text,
      entity: row.getCell(headerMap['entity']).text,
      upload_pwd_status: row.getCell(headerMap['upload_pwd_status']).text,
      upload_pwd: row.getCell(headerMap['upload_pwd']).text,
      username: row.getCell(headerMap['username']).text,
      password: row.getCell(headerMap['password']).text,
    };

    let match = true;
    for (const key of Object.keys(criteria)) {
      const critValue = (criteria as any)[key];
      const accValue = (account as any)[key];

      if (key === 'dcp_access'){
        //support multiple dcp in account access control
        const accessList = accValue.split('/').map((s:string) => s.trim());
        if (!accessList.includes(critValue)){
          match = false;
          break;
        }
      } else {
        if (accValue !== critValue) {
          match = false;
          break;
        }
      }
    }

    if (match) {
      if (!options.multiple) {
        return account; 
      }
      results.push(account); 
    }
  }

  return options.multiple ? results : null;
}

export function generateNewPassword(oldPwd: string): string {
  const match = oldPwd.match(/(\d+)(\D*)$/); 
  if (match) {
    const number = parseInt(match[1], 10);
    return oldPwd.replace(/\d+(\D*)$/, (number + 1) + match[2]);
  } 
  // if no integer, then add 1.
  return oldPwd + '1';
}

export async function updateAccountPasswordInExcel(account: Account, newPassword: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(config.testing_account_path);
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) throw new Error('Worksheet not found!');

  // read the header
  const headerMap: Record<string, number> = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cell.text.trim()] = colNumber;
  });

  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    const username = row.getCell(headerMap['username']).text;
    if (username === account.username) {
      row.getCell(headerMap['password']).value = newPassword;
      row.commit();
      break;
    }
  }

  await workbook.xlsx.writeFile(config.testing_account_path);
}


// old version
export async function getAccountByCriteria(criteria: Partial<Account>): Promise<Account | null> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(config.testing_account_path);
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) throw new Error('Worksheet not found!');

  // read the header
  const headerMap: Record<string, number> = {};
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cell.text.trim()] = colNumber;
  });

  
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    // get the value through header
    const account: Account = {
      dcp_access: row.getCell(headerMap['dcp_access']).text,
      role: row.getCell(headerMap['role']).text,
      env: row.getCell(headerMap['env']).text,
      entity: row.getCell(headerMap['entity']).text,
      upload_pwd_status: row.getCell(headerMap['upload_pwd_status']).text,
      upload_pwd: row.getCell(headerMap['upload_pwd']).text,
      username: row.getCell(headerMap['username']).text,
      password: row.getCell(headerMap['password']).text,
    };

    // match criteria
    let match = true;
    for (const key of Object.keys(criteria)) {
      const critValue = (criteria as any)[key];
      const accValue = (account as any)[key];

      if (key === 'dcp_access'){
        //support multiple dcp in account access control
        const accessList = accValue.split('/').map((s:string) => s.trim());
        if (!accessList.includes(critValue)){
          match = false;
          break;
        }
      } else {
        if (accValue !== critValue) {
          match = false;
          break;
        }
      }
    }

    if (match) {
      return account;
    }
  }

  return null;
}

