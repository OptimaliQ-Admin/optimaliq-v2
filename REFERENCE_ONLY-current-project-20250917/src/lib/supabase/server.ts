import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { Database } from '@/types';

console.log('server.ts - env loaded:', {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_URL: env.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing',
  SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY ? 'present' : 'missing'
});

/**
 * Create a Supabase client for server-side operations
 * Uses service role key for elevated permissions
 */
export function createServerClient() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    // Return null during build time to avoid errors
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      return null;
    }
    throw new Error('Supabase server configuration missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }
  
  return createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

/**
 * Create a Supabase client for API routes with user context
 * Uses anon key with RLS policies
 */
export function createRouteClient() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  
  console.log('createRouteClient - supabaseUrl:', supabaseUrl);
  console.log('createRouteClient - supabaseAnonKey:', supabaseAnonKey ? 'present' : 'missing');
  console.log('createRouteClient - env.NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('createRouteClient - env.SUPABASE_URL:', env.SUPABASE_URL);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null during build time to avoid errors
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      return null;
    }
    throw new Error('Supabase route configuration missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required');
  }
  
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// Default export for backwards compatibility
export { createRouteClient as createClient };
