import { chromium, Page } from 'playwright';

const MONTH_MAP: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4,
  May: 5, June: 6, July: 7, August: 8,
  September: 9, October: 10, November: 11, December: 12
};

function parseISODate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}


export async function setDatePicker(
  page: Page,
  pickerIndex: number,
  targetISODate: string
): Promise<void> {
  // parse target date
  const { year: targetYear, month: targetMonth, day: targetDay } = parseISODate(targetISODate);

  // 1. click date picker
  await page.locator("div[data-testid='POSITION_DATE'] [aria-label='expand date picker']")
    .nth(pickerIndex)
    .click();

  // 2. pending on loading
  await page.waitForSelector('.react-datepicker__current-month');

  // 3. read the current month（format as "January 2025"）
  const currentText = await page.textContent('.react-datepicker__current-month');
  if (!currentText) throw new Error('cannot read the current month');
  const [currentName, currentYearStr] = currentText.split(' ');
  const currentMonth = MONTH_MAP[currentName];
  const currentYear  = parseInt(currentYearStr, 10);

  // 4. calculate the month differences
  const monthDiff = (targetYear - currentYear) * 12 + (targetMonth - currentMonth);
  if (monthDiff !== 0) {
    const navSelector = monthDiff > 0
      ? '[aria-label="Next Month"]'
      : '[aria-label="Previous Month"]';
    const steps = Math.abs(monthDiff);
    for (let i = 0; i < steps; i++) {
      await page.click(navSelector);
      await page.waitForTimeout(200);
    }
  }

  // 5. choose specific date
  try {
    await page.locator(`span[data-testid="DataPicker-day-${targetDay}"]`).click();
    return;
  } catch (error) {
    console.log('Failed to select the specific date.')
  }
}
