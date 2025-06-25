import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminClientAvailable } from "@/lib/supabaseAdmin";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { isValidLinkedInUrl, isValidEmail, isDisposableEmail, normalizeLinkedInUrl } from '@/lib/utils/validation';

export async function POST(req: Request) {
  try {
    // Check if admin client is available
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.' 
      }, { status: 503 });
    }

    const { u_id, updates } = await req.json();

    console.log("📝 Updating user profile");

    if (!u_id || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Server-side validation
    if (updates.email && (!isValidEmail(updates.email) || isDisposableEmail(updates.email))) {
      return NextResponse.json({ error: "Invalid or disposable email address." }, { status: 400 });
    }
    if (updates.linkedin_url && updates.linkedin_url.trim() !== '' && !isValidLinkedInUrl(updates.linkedin_url)) {
      return NextResponse.json({ error: "Invalid LinkedIn profile URL." }, { status: 400 });
    }

    // Normalize LinkedIn URL before saving
    const normalizedUpdates = {
      ...updates,
      linkedin_url: updates.linkedin_url ? normalizeLinkedInUrl(updates.linkedin_url) : updates.linkedin_url
    };

    const { error } = await supabaseAdmin!
      .from("tier2_users")
      .update(normalizedUpdates)
      .eq("u_id", u_id);

    if (error) {
      console.error("❌ Failed to update user:", error);
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }

    // Return the updated data
    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
} 