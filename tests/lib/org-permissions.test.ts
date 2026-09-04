import { describe, expect, it } from 'vitest';
import { can, isOrgRole } from '@/lib/org-permissions';

describe('org permissions', () => {
  it('allows owners to invite members', () => {
    expect(can('owner', 'invitation:create')).toBe(true);
  });

  it('denies members from inviting', () => {
    expect(can('member', 'invitation:create')).toBe(false);
  });

  it('validates org roles', () => {
    expect(isOrgRole('admin')).toBe(true);
    expect(isOrgRole('guest')).toBe(false);
  });
});
