'use client';

import NextLink from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

export function Link({
  href,
  children,
  ...props
}: ComponentProps<typeof NextLink>) {
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}

export function usePathname() {
  return '/dashboard';
}

export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: async () => {},
  };
}

export function redirect() {
  return null;
}

export function getPathname() {
  return '/dashboard';
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
