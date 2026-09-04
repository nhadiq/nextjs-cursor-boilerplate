'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useOrganization } from '@/hooks/use-organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function InviteMemberForm() {
  const t = useTranslations('org');
  const { activeOrg, inviteMember } = useOrganization();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');

  return (
    <form
      className="grid gap-4 rounded-lg border p-4 md:grid-cols-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!activeOrg?.id) return;
        await inviteMember(activeOrg.id, email, role);
        setEmail('');
      }}
    >
      <div className="space-y-2 md:col-span-1">
        <Label htmlFor="invite-email">{t('inviteEmail')}</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>{t('inviteRole')}</Label>
        <Select
          value={role}
          onValueChange={(v) => setRole(v as 'admin' | 'member')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">{t('roleAdmin')}</SelectItem>
            <SelectItem value="member">{t('roleMember')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          {t('sendInvite')}
        </Button>
      </div>
    </form>
  );
}
