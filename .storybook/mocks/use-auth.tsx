'use client';

import type { AuthUser } from '@/hooks/use-auth';

const mockUser: AuthUser = {
  id: 'user-1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  emailVerified: true,
  image: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export function useAuth() {
  return {
    user: mockUser,
    loading: false,
    error: null,
    signUp: async () => ({}),
    signIn: async () => ({}),
    signInWithGoogle: async () => ({}),
    signOut: async () => ({}),
    resetPassword: async () => ({}),
  };
}
