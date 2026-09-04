'use client';

import { authClient } from '@/lib/auth-client';

export function useOrganization() {
  const { data: activeOrg, isPending: activeLoading } =
    authClient.useActiveOrganization();
  const { data: organizations, isPending: orgsLoading } =
    authClient.useListOrganizations();

  return {
    activeOrg: activeOrg ?? null,
    organizations: organizations ?? [],
    loading: activeLoading || orgsLoading,
    error: null,
    switchOrganization: async (organizationId: string) => {
      const result = await authClient.organization.setActive({
        organizationId,
      });
      if (result.error) {
        throw new Error(
          result.error.message ?? 'Failed to switch organization',
        );
      }
      return result;
    },
    createOrganization: async (name: string, slug: string) => {
      const result = await authClient.organization.create({
        name,
        slug,
      });
      if (result.error) {
        throw new Error(
          result.error.message ?? 'Failed to create organization',
        );
      }
      return result;
    },
    inviteMember: async (
      organizationId: string,
      email: string,
      role: 'admin' | 'member' = 'member',
    ) => {
      const result = await authClient.organization.inviteMember({
        organizationId,
        email,
        role,
      });
      if (result.error) {
        throw new Error(result.error.message ?? 'Failed to invite member');
      }
      return result;
    },
    removeMember: async (organizationId: string, memberId: string) => {
      const result = await authClient.organization.removeMember({
        organizationId,
        memberIdOrEmail: memberId,
      });
      if (result.error) {
        throw new Error(result.error.message ?? 'Failed to remove member');
      }
      return result;
    },
    updateMemberRole: async (
      organizationId: string,
      memberId: string,
      role: 'admin' | 'member' | 'owner',
    ) => {
      const result = await authClient.organization.updateMemberRole({
        organizationId,
        memberId,
        role,
      });
      if (result.error) {
        throw new Error(result.error.message ?? 'Failed to update member role');
      }
      return result;
    },
    leaveOrganization: async (organizationId: string) => {
      const result = await authClient.organization.leave({
        organizationId,
      });
      if (result.error) {
        throw new Error(result.error.message ?? 'Failed to leave organization');
      }
      return result;
    },
  };
}
