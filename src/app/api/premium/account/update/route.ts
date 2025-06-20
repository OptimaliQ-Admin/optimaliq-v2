import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { isValidLinkedInUrl, isValidEmail, isDisposableEmail } from '@/lib/utils/validation';

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  
  try {
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

    const { error } = await supabaseAdmin
      .from("tier2_users")
      .update(updates)
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