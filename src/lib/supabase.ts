// src/lib/supabase.ts
"use client"; // Important because this is client-side code

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

// ✅ No need to manually specify URL and Key unless you want to override defaults

export const supabase = createBrowserSupabaseClient();
