'use client';

import { useTranslations } from 'next-intl';
import { withAuth } from '@/components/auth/with-auth';
import { AppShell } from '@/components/layout/app-shell';
import { MemberList } from '@/components/org/member-list';
import { InviteMemberForm } from '@/components/org/invite-member-form';

function MembersSettingsPage() {
  const t = useTranslations('org');
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">{t('members')}</h1>
        <InviteMemberForm />
        <MemberList />
      </div>
    </AppShell>
  );
}

export default withAuth(MembersSettingsPage);
