import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { runAuthGuard } from '@/lib/auth-guard';

describe('middleware route protection', () => {
  it('redirects unauthenticated users from locale-prefixed protected routes', () => {
    const request = new NextRequest('http://localhost:3000/en/dashboard');
    const response = runAuthGuard(request, '/en/dashboard', 'en', ['en', 'ar']);

    expect(response?.status).toBe(307);
    const location = response?.headers.get('location');
    expect(location).toContain('/en/auth/signin');
    expect(location).toContain('redirect=%2Fen%2Fdashboard');
  });

  it('redirects unauthenticated users from Arabic protected routes', () => {
    const request = new NextRequest('http://localhost:3000/ar/profile');
    const response = runAuthGuard(request, '/ar/profile', 'ar', ['en', 'ar']);

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain('/ar/auth/signin');
  });

  it('allows public auth routes without a session cookie', () => {
    const request = new NextRequest('http://localhost:3000/en/auth/signin');
    const response = runAuthGuard(request, '/en/auth/signin', 'en', [
      'en',
      'ar',
    ]);

    expect(response).toBeNull();
  });

  it('redirects authenticated users away from sign in', () => {
    const request = new NextRequest('http://localhost:3000/en/auth/signin', {
      headers: {
        cookie: 'better-auth.session_token=test-session',
      },
    });

    const response = runAuthGuard(request, '/en/auth/signin', 'en', [
      'en',
      'ar',
    ]);

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain('/en/dashboard');
  });
});
