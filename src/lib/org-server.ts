import { headers } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  ForbiddenError,
  requireOrgPermission,
  scopeToActiveOrg,
} from '@/lib/tenant-guard';
import type { OrgPermission } from '@/lib/org-permissions';

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function requireSession() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new ForbiddenError('Authentication required');
  }

  return session;
}

export async function getActiveOrganization() {
  const session = await requireSession();
  const orgId = session.session.activeOrganizationId;

  if (!orgId) {
    return null;
  }

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  if (!organization) {
    return null;
  }

  const membership = organization.members.find(
    (member) => member.userId === session.user.id,
  );

  if (!membership) {
    return null;
  }

  return {
    organization,
    membership,
    role: membership.role,
  };
}

export async function requireOrganization(locale = 'en') {
  const active = await getActiveOrganization();

  if (!active) {
    redirect({ href: '/org/new', locale });
  }

  return active;
}

export async function listUserOrganizations(userId: string) {
  const memberships = await prisma.member.findMany({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: 'asc' },
  });

  return memberships.map((membership) => ({
    ...membership.organization,
    role: membership.role,
  }));
}

export async function checkOrgPermission(
  userId: string,
  organizationId: string,
  permission: OrgPermission,
) {
  await requireOrgPermission(userId, organizationId, permission);
}

export async function getScopedOrgId(
  userId: string,
  sessionOrgId?: string | null,
) {
  return scopeToActiveOrg(userId, sessionOrgId);
}

export { ForbiddenError, NotFoundError } from '@/lib/tenant-guard';
