import { describe, expect, it } from 'vitest';
import { rateLimitAuth } from '@/lib/rate-limit';

describe('rate limiting', () => {
  it('returns 429 after threshold for auth endpoints', async () => {
    const key = `test-${Date.now()}`;

    for (let i = 0; i < 10; i += 1) {
      const result = await rateLimitAuth(key);
      expect(result.success).toBe(true);
    }

    const blocked = await rateLimitAuth(key);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
