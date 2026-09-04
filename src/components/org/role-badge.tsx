'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';

const roleVariant = {
  owner: 'default',
  admin: 'secondary',
  member: 'outline',
} as const;

export function RoleBadge({ role }: { role: 'owner' | 'admin' | 'member' }) {
  const t = useTranslations('org');
  const labels = {
    owner: t('roleOwner'),
    admin: t('roleAdmin'),
    member: t('roleMember'),
  };

  return <Badge variant={roleVariant[role]}>{labels[role]}</Badge>;
}
