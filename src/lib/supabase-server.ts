import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create server client for server components
export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean; httpOnly?: boolean; }) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Handle cookie set error
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean; httpOnly?: boolean; }) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            // Handle cookie remove error
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
};


