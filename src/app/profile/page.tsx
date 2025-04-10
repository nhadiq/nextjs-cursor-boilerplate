'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const { user, loading, signOut, provider, setProvider } = useAuth();
  const router = useRouter();
  const [initials, setInitials] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);
  
  // Calculate initials for avatar fallback
  useEffect(() => {
    if (user?.displayName) {
      const nameParts = user.displayName.split(' ');
      if (nameParts.length >= 2) {
        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
      } else if (nameParts.length === 1) {
        setInitials(nameParts[0][0]);
      }
    } else if (user?.email) {
      setInitials(user.email[0].toUpperCase());
    }
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <Card className="mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.displayName || 'User Profile'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs 
            defaultValue={provider} 
            onValueChange={(value) => setProvider(value as 'firebase' | 'supabase')}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="firebase">Firebase</TabsTrigger>
              <TabsTrigger value="supabase">Supabase</TabsTrigger>
            </TabsList>
            
            <TabsContent value="firebase" className="mt-6 space-y-4">
              <div className="text-sm">
                Currently using Firebase Authentication
              </div>
            </TabsContent>
            
            <TabsContent value="supabase" className="mt-6 space-y-4">
              <div className="text-sm">
                Currently using Supabase Authentication
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>User ID</Label>
                <div className="rounded bg-muted px-3 py-2 font-mono text-sm">
                  {user.id}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Provider</Label>
                <div className="rounded bg-muted px-3 py-2 font-mono text-sm">
                  {user.provider}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
          <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 