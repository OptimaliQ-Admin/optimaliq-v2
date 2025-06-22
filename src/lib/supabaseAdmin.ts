import { createClient } from "@supabase/supabase-js";

// Admin URL + Service Role key (not public)
const supabaseAdminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ❗ NOT the anon key

// Validate environment variables
if (!supabaseAdminUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
}

if (!supabaseServiceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
}

// Only create client if both variables are available
export const supabaseAdmin = supabaseAdminUrl && supabaseServiceRoleKey 
  ? createClient(supabaseAdminUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

// Helper function to check if admin client is available
export const isAdminClientAvailable = () => {
  return supabaseAdmin !== null;
};
