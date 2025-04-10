import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type AuthProvider as AuthProviderType } from '@/lib/auth';
import * as FirebaseAuth from '@/lib/firebase';
import * as SupabaseAuth from '@/lib/supabase';

// Define user type that works with both Firebase and Supabase
export type AuthUser = {
  id: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  provider: 'firebase' | 'supabase';
  // Add any other common fields here
};

// Auth context type
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  provider: AuthProviderType;
  setProvider: (provider: AuthProviderType) => void;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
  initialProvider?: AuthProviderType;
}

// Function to normalize user data
const normalizeUserData = (
  user: any,
  provider: AuthProviderType
): AuthUser | null => {
  if (!user) return null;

  if (provider === 'firebase') {
    return {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: 'firebase',
    };
  } else {
    return {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.full_name,
      photoURL: user.user_metadata?.avatar_url,
      provider: 'supabase',
    };
  }
};

// Auth provider component
export function AuthProvider({ 
  children, 
  initialProvider 
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [provider, setProvider] = useState<AuthProviderType>(
    initialProvider || authService.getProvider()
  );

  // Update the auth service when provider changes
  useEffect(() => {
    authService.setProvider(provider);
  }, [provider]);

  // Set up auth state listener
  useEffect(() => {
    setLoading(true);
    
    // Function to handle auth state changes
    const handleAuthStateChange = async () => {
      try {
        if (provider === 'firebase') {
          // Set up Firebase auth listener
          const unsubscribe = FirebaseAuth.onAuthStateChange((user) => {
            setUser(normalizeUserData(user, 'firebase'));
            setLoading(false);
          });
          
          return () => unsubscribe();
        } else {
          // Set up Supabase auth listener
          const { data } = SupabaseAuth.supabase.auth.onAuthStateChange(
            async (_event, session) => {
              setUser(normalizeUserData(session?.user || null, 'supabase'));
              setLoading(false);
            }
          );
          
          // Initialize with current session
          const session = await SupabaseAuth.getSession();
          setUser(normalizeUserData(session?.user || null, 'supabase'));
          setLoading(false);
          
          return () => {
            data.subscription.unsubscribe();
          };
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication error'));
        setLoading(false);
        return () => {}; // Return a no-op cleanup function on error
      }
    };

    const cleanup = handleAuthStateChange();
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then((fn) => fn && fn());
      } else if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [provider]);

  // Auth methods
  const signUp = async (email: string, password: string) => {
    try {
      return await authService.signUpWithEmailAndPassword(email, password);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign up failed'));
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      return await authService.signInWithEmailAndPassword(email, password);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign in failed'));
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      return await authService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Google sign in failed'));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign out failed'));
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      return await authService.resetPassword(email);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Password reset failed'));
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    provider,
    setProvider,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 