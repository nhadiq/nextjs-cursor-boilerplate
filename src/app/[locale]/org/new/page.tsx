'use client';

import { useTranslations } from 'next-intl';
import { withAuth } from '@/components/auth/with-auth';
import { AppShell } from '@/components/layout/app-shell';
import { OrgCreateForm } from '@/components/org/org-create-form';

function NewOrgPage() {
  const t = useTranslations('org');
  return (
    <AppShell>
      <div className="mx-auto max-w-lg space-y-4">
        <h1 className="text-2xl font-bold">{t('createOrganization')}</h1>
        <OrgCreateForm />
      </div>
    </AppShell>
  );
}

export default withAuth(NewOrgPage);
