import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { Database } from '@/types';

/**
 * Create a Supabase client for server-side operations
 * Uses service role key for elevated permissions
 */
export function createServerClient() {
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
