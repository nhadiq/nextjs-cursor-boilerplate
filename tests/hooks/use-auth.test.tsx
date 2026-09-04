import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/hooks/use-auth';

const mockUseSession = vi.fn();
const mockSignInEmail = vi.fn();
const mockSignUpEmail = vi.fn();
const mockSignOut = vi.fn();
const mockSignInSocial = vi.fn();
const mockRequestPasswordReset = vi.fn();

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: () => mockUseSession(),
    signIn: {
      email: (...args: unknown[]) => mockSignInEmail(...args),
      social: (...args: unknown[]) => mockSignInSocial(...args),
    },
    signUp: {
      email: (...args: unknown[]) => mockSignUpEmail(...args),
    },
    signOut: (...args: unknown[]) => mockSignOut(...args),
    requestPasswordReset: (...args: unknown[]) =>
      mockRequestPasswordReset(...args),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    });
  });

  it('returns null user when there is no session', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('returns the authenticated user from the session', () => {
    const user = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUseSession.mockReturnValue({
      data: { user },
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(user);
  });

  it('signs in with email and password', async () => {
    mockSignInEmail.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());
    await result.current.signIn('test@example.com', 'password123');

    expect(mockSignInEmail).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('throws when sign in fails', async () => {
    mockSignInEmail.mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.signIn('test@example.com', 'wrong'),
    ).rejects.toThrow('Invalid credentials');
  });

  it('signs out successfully', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());
    await result.current.signOut();

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('signs in with Google using locale-prefixed callback', async () => {
    mockSignInSocial.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());
    await result.current.signInWithGoogle();

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: 'google',
      callbackURL: '/en/dashboard',
    });
  });

  it('reports loading while session is pending', () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });
});
