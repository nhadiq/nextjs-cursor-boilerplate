import { prisma } from '@/lib/db';
import { ForbiddenError, assertOrgMember } from '@/lib/tenant-guard';
import { isValidOrgSlug } from '@/lib/utils';

export async function getOrganizationByIdForUser(
  organizationId: string,
  userId: string,
) {
  await assertOrgMember(userId, organizationId);

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      invitations: true,
    },
  });

  if (!organization) {
    throw new ForbiddenError('Organization not found');
  }

  return organization;
}

export async function validateOrgSlug(slug: string) {
  if (!isValidOrgSlug(slug)) {
    throw new ForbiddenError('Invalid organization slug');
  }

  const existing = await prisma.organization.findUnique({ where: { slug } });
  return { available: !existing };
}
