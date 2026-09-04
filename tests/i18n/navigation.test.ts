import { describe, expect, it } from 'vitest';
import { withLocalePrefix } from '@/lib/auth-guard';

describe('locale navigation', () => {
  it('prefixes URLs with locale segment', () => {
    expect(withLocalePrefix('/dashboard', 'ar', ['en', 'ar'])).toBe(
      '/ar/dashboard',
    );
  });
});
