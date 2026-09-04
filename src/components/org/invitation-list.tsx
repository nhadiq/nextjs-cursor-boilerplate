'use client';

import { useTranslations } from 'next-intl';
import { useOrganization } from '@/hooks/use-organization';

export function InvitationList() {
  const t = useTranslations('org');
  const { activeOrg } = useOrganization();
  const invitations =
    (
      activeOrg as {
        invitations?: Array<{ id: string; email: string; status: string }>;
      }
    )?.invitations ?? [];

  if (!invitations.length) {
    return (
      <p className="text-muted-foreground text-sm">{t('pendingInvites')}: 0</p>
    );
  }

  return (
    <ul className="space-y-2">
      {invitations.map((invite) => (
        <li
          key={invite.id}
          className="flex items-center justify-between rounded-md border p-3 text-sm"
        >
          <span>{invite.email}</span>
          <span className="text-muted-foreground">{invite.status}</span>
        </li>
      ))}
    </ul>
  );
}
