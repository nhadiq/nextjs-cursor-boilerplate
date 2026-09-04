'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { actionClient } from '@/lib/safe-action';
import { requireSession } from '@/lib/org-server';
import { updateUserProfile } from '@/services/profile.service';
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const updateProfileAction = actionClient
  .schema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    const session = await requireSession();

    await updateUserProfile(session.user.id, {
      name: parsedInput.name,
      image: parsedInput.image || null,
    });

    revalidatePath('/profile');

    return { name: parsedInput.name };
  });
