'use client';

import { useTranslations } from 'next-intl';
import { withAuth } from '@/components/auth/with-auth';
import { AppShell } from '@/components/layout/app-shell';
import { InvitationList } from '@/components/org/invitation-list';

function InvitationsSettingsPage() {
  const t = useTranslations('org');
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">{t('invitations')}</h1>
        <InvitationList />
      </div>
    </AppShell>
  );
}

export default withAuth(InvitationsSettingsPage);
