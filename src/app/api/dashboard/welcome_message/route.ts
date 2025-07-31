import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { u_id } = await req.json();

  if (!u_id) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // Fetch user's first name
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("first_name")
    .eq("u_id", u_id)
    .single();

  if (userError || !user) {
    console.error("❌ User lookup failed:", userError);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ Fetch a random quote using typed RPC (2 type args for older Supabase versions)
  const { data: quoteData, error: quoteError } = await supabase
    .rpc<any, void>("get_random_quote")
    .single();

  if (quoteError) {
    console.error("❌ Quote fetch error:", quoteError);
  }

  const quote = quoteData ?? {
    quote: "Welcome back! Let's make today productive.",
    author: "GMF+",
  };

  return NextResponse.json({
    firstName: user.first_name,
    quote: quote.quote,
    author: quote.author,
  });
}
