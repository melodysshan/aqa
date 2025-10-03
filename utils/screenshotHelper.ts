import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

export async function takeStepScreenshot(page: Page, testID: string, stepName: string) {
  const folder = path.join("screenshots", testID);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const filePath = path.join(folder, `${stepName}.png`);
  await page.screenshot({ path: filePath });
  return filePath;
}