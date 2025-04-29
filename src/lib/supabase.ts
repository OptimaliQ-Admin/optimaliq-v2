// src/lib/supabase.ts
"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createPagesBrowserClient();
