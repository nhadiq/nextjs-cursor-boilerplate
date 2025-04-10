'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const router = useRouter();
  const { signUp, provider, setProvider } = useAuth();
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    // Basic password strength check
    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      await signUp(email, password);
      
      // After successful signup
      if (provider === 'firebase') {
        // Firebase typically signs the user in automatically
        router.push('/dashboard');
      } else {
        // Supabase typically sends a confirmation email
        router.push('/auth/verify-email?email=' + encodeURIComponent(email));
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthError(
        error instanceof Error 
          ? error.message 
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>
        
        <Tabs 
          defaultValue={provider} 
          onValueChange={(value) => setProvider(value as 'firebase' | 'supabase')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="firebase">Firebase</TabsTrigger>
            <TabsTrigger value="supabase">Supabase</TabsTrigger>
          </TabsList>
          
          <TabsContent value="firebase" className="mt-4">
            <div className="text-center text-sm mb-4">
              Using Firebase Authentication
            </div>
          </TabsContent>
          
          <TabsContent value="supabase" className="mt-4">
            <div className="text-center text-sm mb-4">
              Using Supabase Authentication
            </div>
          </TabsContent>
        </Tabs>
        
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link 
            href="/auth/signin" 
            className="font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          By creating an account, you agree to our{' '}
          <Link 
            href="/terms" 
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link 
            href="/privacy" 
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>.
        </div>
      </div>
    </div>
  );
} 