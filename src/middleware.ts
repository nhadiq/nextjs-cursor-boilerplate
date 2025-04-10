import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define which routes should be protected
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  // Add any other protected routes here
];

// Define which routes are public (for auth services that don't
// have built-in redirect handling)
const PUBLIC_AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
  // Add any other auth routes here
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the requested route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If route is not protected and not an auth route, don't apply any auth logic
  if (!isProtectedRoute && !isPublicAuthRoute) {
    return NextResponse.next();
  }
  
  // Get authentication provider from request
  // This could be from a cookie, query parameter, or environment variable
  // Default to 'firebase' if not specified
  const authProvider = request.cookies.get('auth_provider')?.value || 
    process.env.NEXT_PUBLIC_AUTH_PROVIDER || 
    'firebase';
  
  // Handle authentication based on provider
  if (authProvider === 'supabase') {
    return handleSupabaseAuth(request, isProtectedRoute, isPublicAuthRoute);
  } else {
    // Firebase or other providers
    return handleFirebaseAuth(request, isProtectedRoute, isPublicAuthRoute);
  }
}

async function handleSupabaseAuth(
  request: NextRequest,
  isProtectedRoute: boolean,
  isPublicAuthRoute: boolean
) {
  // Create a Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // This is a read-only operation in middleware
          // We will handle this in the actual routes
        },
        remove(name: string, options: any) {
          // This is a read-only operation in middleware
          // We will handle this in the actual routes
        },
      },
    }
  );
  
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (isProtectedRoute && !session) {
      // User is not authenticated but trying to access protected route
      const redirectUrl = new URL('/auth/signin', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (isPublicAuthRoute && session) {
      // User is authenticated but trying to access auth route
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    console.error('Error in Supabase auth middleware:', error);
    // On error, allow the request to proceed
    // The server component can handle the auth state more gracefully
  }
  
  return NextResponse.next();
}

async function handleFirebaseAuth(
  request: NextRequest,
  isProtectedRoute: boolean,
  isPublicAuthRoute: boolean
) {
  // Firebase authentication check
  // For Firebase, we'd typically rely on a session cookie
  const sessionCookie = request.cookies.get('firebase_session')?.value;
  
  // This is a simplified example - in a real app, you'd verify this cookie
  // with Firebase Admin SDK in a more secure way
  const isAuthenticated = !!sessionCookie;
  
  if (isProtectedRoute && !isAuthenticated) {
    // User is not authenticated but trying to access protected route
    const redirectUrl = new URL('/auth/signin', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (isPublicAuthRoute && isAuthenticated) {
    // User is authenticated but trying to access auth route
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Only run middleware on matching routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public/... (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 