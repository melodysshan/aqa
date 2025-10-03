import ExcelJS from 'exceljs';

interface Account {
  dcp_access: string;
  role: string;
  env: string;
  entity: string;
  upload_pwd: string;
  username: string;
  password: string;
}

export async function getAccountByCriteria(criteria: Partial<Account>): Promise<Account | null> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('J:\\Projects\\CSP AQA\\csp-new-gen-aqa-main\\test_accounts\\test_accounts.xlsx');
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
      upload_pwd: row.getCell(headerMap['upload_pwd']).text,
      username: row.getCell(headerMap['username']).text,
      password: row.getCell(headerMap['password']).text,
    };

    // match criteria
    let match = true;
    for (const key of Object.keys(criteria)) {
      if ((account as any)[key] !== (criteria as any)[key]) {
        match = false;
        break;
      }
    }

    if (match) {
      return account;
    }
  }

  return null;
}

