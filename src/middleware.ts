import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { runAuthGuard } from '@/lib/auth-guard';
import { getRetryAfterSeconds, rateLimitAuth } from '@/lib/rate-limit';

const intlMiddleware = createMiddleware(routing);

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    const ip = getClientIp(request);
    const result = await rateLimitAuth(`auth:${ip}`);

    if (!result.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(getRetryAfterSeconds(result.reset)),
        },
      });
    }

    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);

  const locale =
    request.nextUrl.pathname.split('/')[1] ?? routing.defaultLocale;
  const validLocale = routing.locales.includes(
    locale as (typeof routing.locales)[number],
  )
    ? locale
    : routing.defaultLocale;

  const authResponse = runAuthGuard(request, pathname, validLocale, [
    ...routing.locales,
  ]);

  if (authResponse) {
    return authResponse;
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
