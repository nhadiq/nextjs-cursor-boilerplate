'use client';

import { withAuth } from '@/components/auth/with-auth';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function DashboardPage() {
  const { user, provider } = useAuth();
  
  return (
    <div className="container max-w-6xl py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.displayName || user?.email}</CardTitle>
            <CardDescription>
              You are authenticated with {provider}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This is a protected route. You can only see this page if you are authenticated.
            </p>
            <Link href="/profile">
              <Button>View Profile</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Auth Details</CardTitle>
            <CardDescription>
              Authentication information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>User ID:</strong> {user?.id}
              </div>
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Provider:</strong> {user?.provider}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Things you can do
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/">
              <Button variant="outline" className="w-full">Go to Home</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full">Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Protect this page with authentication
export default withAuth(DashboardPage); 