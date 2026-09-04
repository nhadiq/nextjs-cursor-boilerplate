import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ForbiddenError, assertOrgMember } from '@/lib/tenant-guard';

const findFirst = vi.fn();

vi.mock('@/lib/db', () => ({
  prisma: {
    member: {
      findFirst: (...args: unknown[]) => findFirst(...args),
    },
  },
}));

describe('tenant isolation', () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it('throws when user is not a member of the organization', async () => {
    findFirst.mockResolvedValue(null);

    await expect(assertOrgMember('user-a', 'org-b')).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it('returns membership when user belongs to organization', async () => {
    findFirst.mockResolvedValue({ role: 'member' });

    await expect(assertOrgMember('user-a', 'org-a')).resolves.toEqual({
      role: 'member',
    });
  });
});
