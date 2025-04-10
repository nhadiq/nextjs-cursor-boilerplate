import * as FirebaseAuth from './firebase';
import * as SupabaseAuth from './supabase';

// Auth provider type
export type AuthProvider = 'firebase' | 'supabase';

// Default auth provider - can be set via an environment variable
export const DEFAULT_AUTH_PROVIDER: AuthProvider = 
  (process.env.NEXT_PUBLIC_AUTH_PROVIDER as AuthProvider) || 'firebase';

/**
 * Auth service that provides a unified interface for both Firebase and Supabase
 */
export class AuthService {
  private provider: AuthProvider;

  constructor(provider: AuthProvider = DEFAULT_AUTH_PROVIDER) {
    this.provider = provider;
  }

  /**
   * Set the authentication provider
   */
  setProvider(provider: AuthProvider) {
    this.provider = provider;
  }

  /**
   * Get the current authentication provider
   */
  getProvider(): AuthProvider {
    return this.provider;
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmailAndPassword(email: string, password: string) {
    return this.provider === 'firebase'
      ? FirebaseAuth.signUpWithEmailAndPassword(email, password)
      : SupabaseAuth.signUpWithEmailAndPassword(email, password);
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmailAndPassword(email: string, password: string) {
    return this.provider === 'firebase'
      ? FirebaseAuth.signInWithEmailAndPassword(email, password)
      : SupabaseAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    return this.provider === 'firebase'
      ? FirebaseAuth.signInWithGoogle()
      : SupabaseAuth.signInWithGoogle();
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    return this.provider === 'firebase'
      ? FirebaseAuth.signOutUser()
      : SupabaseAuth.signOutUser();
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    return this.provider === 'firebase'
      ? FirebaseAuth.resetPassword(email)
      : SupabaseAuth.resetPassword(email);
  }

  /**
   * Get the current user
   */
  async getCurrentUser() {
    return this.provider === 'firebase'
      ? FirebaseAuth.getCurrentUser()
      : SupabaseAuth.getCurrentUser();
  }

  /**
   * Get the auth instance
   */
  getAuthInstance() {
    return this.provider === 'firebase'
      ? FirebaseAuth.auth
      : SupabaseAuth.supabase.auth;
  }
}

// Create and export a default auth service instance
export const authService = new AuthService(); 