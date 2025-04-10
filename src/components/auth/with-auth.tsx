'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { redirectTo?: string } = {}
) {
  const { redirectTo = '/auth/signin' } = options;
  
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!loading && !user) {
        // Add redirect query parameter to preserve the original destination
        const redirectUrl = new URL(redirectTo, window.location.origin);
        redirectUrl.searchParams.set('redirect', window.location.pathname);
        router.push(redirectUrl.pathname + redirectUrl.search);
      }
    }, [router, loading, user]);
    
    // Show loading state
    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      );
    }
    
    // If not authenticated, don't render anything
    if (!user) {
      return null;
    }
    
    // If authenticated, render the component
    return <Component {...props} />;
  };
} 