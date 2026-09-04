import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('auth pages accessibility', () => {
  test('sign in page has no axe violations', async ({ page }) => {
    await page.goto('/en/auth/signin');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
