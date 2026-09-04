import { test, expect } from '@playwright/test';

test.describe('RTL layout', () => {
  test('arabic home page sets dir=rtl on html', async ({ page }) => {
    await page.goto('/ar');
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');
  });
});
