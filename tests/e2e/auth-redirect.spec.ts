import { test, expect } from '@playwright/test';

test.describe('auth route protection', () => {
  test('redirects unauthenticated users from dashboard to sign in', async ({
    page,
  }) => {
    await page.goto('/en/dashboard');
    await expect(page).toHaveURL(/\/en\/auth\/signin/);
  });

  test('redirects unauthenticated users from profile to sign in', async ({
    page,
  }) => {
    await page.goto('/en/profile');
    await expect(page).toHaveURL(/\/en\/auth\/signin/);
  });

  test('allows access to sign in page without authentication', async ({
    page,
  }) => {
    await page.goto('/en/auth/signin');
    await expect(page).toHaveURL(/\/en\/auth\/signin/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
