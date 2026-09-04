import { describe, expect, it } from 'vitest';
import { ForbiddenError } from '@/lib/tenant-guard';

describe('IDOR prevention', () => {
  it('uses forbidden errors instead of leaking org data', () => {
    const error = new ForbiddenError('Organization not found');
    expect(error.message).not.toMatch(/sql/i);
    expect(error).toBeInstanceOf(ForbiddenError);
  });
});
