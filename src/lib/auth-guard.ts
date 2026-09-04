import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * Optimistic route protection for proxy (Next.js 16).
 *
 * Uses `getSessionCookie()` for fast redirects — cookie presence only.
 * This is NOT authorization. Protected pages, RSC, and server actions
 * MUST call `auth.api.getSession()` and verify permissions server-side.
 *
 * Routes in `SENSITIVE_ROUTES` require full session validation in
 * server code; never rely on this guard alone for those paths.
 */
export const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/org'];

export const PUBLIC_AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/verify-email',
];

export const SENSITIVE_ROUTES = ['/settings', '/org'];

export function stripLocalePrefix(pathname: string, locales: string[]): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (maybeLocale && locales.includes(maybeLocale)) {
    const rest = segments.slice(2).join('/');
    return rest ? `/${rest}` : '/';
  }

  return pathname;
}

export function withLocalePrefix(
  path: string,
  locale: string,
  locales: string[],
): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withoutLocale = stripLocalePrefix(normalized, locales);
  return `/${locale}${withoutLocale === '/' ? '' : withoutLocale}`;
}

export function runAuthGuard(
  request: NextRequest,
  pathname: string,
  locale: string,
  locales: string[],
): NextResponse | null {
  const pathWithoutLocale = stripLocalePrefix(pathname, locales);

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(
    (route) =>
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );

  if (!isProtectedRoute && !isPublicAuthRoute) {
    return null;
  }

  const sessionCookie = getSessionCookie(request);

  if (isProtectedRoute && !sessionCookie) {
    const signInPath = withLocalePrefix('/auth/signin', locale, locales);
    const redirectUrl = new URL(signInPath, request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isPublicAuthRoute && sessionCookie) {
    const dashboardPath = withLocalePrefix('/dashboard', locale, locales);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return null;
}
