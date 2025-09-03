import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { Database } from '@/types';

/**
 * Create a Supabase client for server-side operations
 * Uses service role key for elevated permissions
 */
export function createServerClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return null during build time to avoid errors
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      return null;
    }
    throw new Error('Supabase server configuration missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }
  
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
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
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return null during build time to avoid errors
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      return null;
    }
    throw new Error('Supabase route configuration missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required');
  }
  
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
