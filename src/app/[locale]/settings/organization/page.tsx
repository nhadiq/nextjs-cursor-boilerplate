'use client';

import { useTranslations } from 'next-intl';
import { withAuth } from '@/components/auth/with-auth';
import { AppShell } from '@/components/layout/app-shell';
import { OrgSettingsForm } from '@/components/org/org-settings-form';

function OrganizationSettingsPage() {
  const t = useTranslations('org');
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <OrgSettingsForm />
      </div>
    </AppShell>
  );
}

export default withAuth(OrganizationSettingsPage);
