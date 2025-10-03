import * as fs from "fs";
import * as path from "path";

export function enrichTestCasesWithFilePath(
  testCases: any[],
  testDataFolder: string
): any[] {
  return testCases.map(tc => {
    let folderName = "";

    if (tc.testCase?.toLowerCase() === "failed preliminary rules") {
      folderName = "1 zip - failed prelim";
    } else if (tc.testCase?.toLowerCase() === "passed preliminary rules - without upload password") {
      folderName = "2 files - passed prelim";
    } else if (tc.testCase?.toLowerCase() === "passed preliminary rules - with upload password") {
      folderName = "3 zip - passed prelim";
    } else {
        console.log(`No such testCaseType as ${tc.testCase}.`)
    }

    const folderPath = path.join(
      testDataFolder,
      tc.dcp,
      tc.submissionType,
      tc.dataArea,
      folderName
    );

    return {
      ...tc,
      folder_path: folderPath,
    };
  });
}





export function getFilesFromFolder(folderPath: string, extensions?: string[]): string[] {
  if (!fs.existsSync(folderPath)) {
    throw new Error(`❌ Folder not found: ${folderPath}`);
  }

  let files: string[] = fs.readdirSync(folderPath)
    .filter((file: string) => fs.lstatSync(path.join(folderPath, file)).isFile());

  // if there is file types extensions
  if (extensions && extensions.length > 0) {
    files = files.filter((file: string) =>
      extensions.includes(path.extname(file).toLowerCase())
    );
  }

  return files.map((file: string) => path.join(folderPath, file));
}

