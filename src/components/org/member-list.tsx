'use client';

import { useTranslations } from 'next-intl';
import { useOrganization } from '@/hooks/use-organization';
import { RoleBadge } from '@/components/org/role-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function MemberList() {
  const t = useTranslations('org');
  const { activeOrg } = useOrganization();
  const members =
    (
      activeOrg as {
        members?: Array<{
          id: string;
          userId: string;
          role: string;
          user?: { name?: string };
        }>;
      }
    )?.members ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('members')}</TableHead>
          <TableHead>{t('inviteRole')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.user?.name ?? member.userId}</TableCell>
            <TableCell>
              <RoleBadge
                role={(member.role as 'owner' | 'admin' | 'member') ?? 'member'}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
