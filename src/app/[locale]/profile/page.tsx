'use client';

import { withAuth } from '@/components/auth/with-auth';
import { AppShell } from '@/components/layout/app-shell';
import { ProfileForm } from '@/components/profile/profile-form';

function ProfilePage() {
  return (
    <AppShell>
      <ProfileForm />
    </AppShell>
  );
}

export default withAuth(ProfilePage);
