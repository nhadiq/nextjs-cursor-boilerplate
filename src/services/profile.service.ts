import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { ForbiddenError } from '@/lib/tenant-guard';

export type UpdateProfileInput = {
  name: string;
  image?: string | null;
};

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.id !== userId) {
    throw new ForbiddenError('Authentication required');
  }

  const result = await auth.api.updateUser({
    headers: await headers(),
    body: {
      name: input.name,
      image: input.image || undefined,
    },
  });

  if (!result) {
    throw new ForbiddenError('Failed to update profile');
  }

  return result;
}
