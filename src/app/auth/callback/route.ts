import { createSupabaseServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// This route is used for handling the Supabase OAuth callback
export async function GET(request: NextRequest) {
  try {
    // Create a Supabase client
    const supabase = createSupabaseServerClient();

    // Get the code from the URL
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to the home page or a protected route
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/auth/error?message=Could not authenticate user', request.url)
    );
  }
} 