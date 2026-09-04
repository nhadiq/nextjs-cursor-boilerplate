'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useOrganization } from '@/hooks/use-organization';
import { useAuth } from '@/hooks/use-auth';

export function withOrg<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedOrgRoute(props: P) {
    const { user, loading: authLoading } = useAuth();
    const { activeOrg, loading: orgLoading } = useOrganization();
    const router = useRouter();

    useEffect(() => {
      if (!authLoading && !user) {
        router.push('/auth/signin');
        return;
      }
      if (!orgLoading && user && !activeOrg) {
        router.push('/org/new');
      }
    }, [authLoading, orgLoading, user, activeOrg, router]);

    if (authLoading || orgLoading || !user || !activeOrg) {
      return null;
    }

    return <Component {...props} />;
  };
}
