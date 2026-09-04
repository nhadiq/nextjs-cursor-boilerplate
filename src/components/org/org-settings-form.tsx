'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useOrganization } from '@/hooks/use-organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function OrgSettingsForm() {
  const t = useTranslations('org');
  const tCommon = useTranslations('common');
  const { activeOrg } = useOrganization();
  const [name, setName] = useState(activeOrg?.name ?? '');
  const [slug, setSlug] = useState(activeOrg?.slug ?? '');
  const [loading, setLoading] = useState(false);

  if (!activeOrg) {
    return null;
  }

  return (
    <form
      className="space-y-4 rounded-lg border p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const { authClient } = await import('@/lib/auth-client');
          const result = await authClient.organization.update({
            organizationId: activeOrg.id,
            data: { name, slug },
          });
          if (result.error) {
            toast.error(result.error.message ?? tCommon('error'));
            return;
          }
          toast.success(tCommon('save'));
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="settings-name">{t('orgName')}</Label>
        <Input
          id="settings-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="settings-slug">{t('orgSlug')}</Label>
        <Input
          id="settings-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? tCommon('loading') : tCommon('save')}
      </Button>
    </form>
  );
}
