export type OrgRole = 'owner' | 'admin' | 'member';

export type OrgPermission =
  | 'organization:update'
  | 'organization:delete'
  | 'member:create'
  | 'member:update'
  | 'member:delete'
  | 'invitation:create'
  | 'invitation:cancel';

const ROLE_PERMISSIONS: Record<OrgRole, OrgPermission[]> = {
  owner: [
    'organization:update',
    'organization:delete',
    'member:create',
    'member:update',
    'member:delete',
    'invitation:create',
    'invitation:cancel',
  ],
  admin: [
    'organization:update',
    'member:create',
    'member:update',
    'member:delete',
    'invitation:create',
    'invitation:cancel',
  ],
  member: [],
};

export function can(role: OrgRole, permission: OrgPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function isOrgRole(value: string): value is OrgRole {
  return value === 'owner' || value === 'admin' || value === 'member';
}
