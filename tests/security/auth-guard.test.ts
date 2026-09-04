import { describe, expect, it } from 'vitest';
import {
  PROTECTED_ROUTES,
  PUBLIC_AUTH_ROUTES,
  stripLocalePrefix,
  withLocalePrefix,
} from '@/lib/auth-guard';

describe('auth guard helpers', () => {
  it('strips locale prefix from paths', () => {
    expect(stripLocalePrefix('/en/dashboard', ['en', 'ar'])).toBe('/dashboard');
    expect(stripLocalePrefix('/ar/settings/members', ['en', 'ar'])).toBe(
      '/settings/members',
    );
  });

  it('adds locale prefix to paths', () => {
    expect(withLocalePrefix('/dashboard', 'en', ['en', 'ar'])).toBe(
      '/en/dashboard',
    );
  });

  it('defines protected and public auth routes', () => {
    expect(PROTECTED_ROUTES).toContain('/dashboard');
    expect(PUBLIC_AUTH_ROUTES).toContain('/auth/signin');
  });
});
