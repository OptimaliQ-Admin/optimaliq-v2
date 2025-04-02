import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Fetch user's first name
  const { data: userData, error: userError } = await supabase
    .from('tier2_users')
    .select('first_name')
    .eq('email', email)
    .single();

  if (userError || !userData) {
    console.error("❌ User lookup failed:", userError);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Fetch a random inspirational quote
  const { data: quoteData, error: quoteError } = await supabase
  .rpc('get_random_quote')
  .single();


  if (quoteError) {
    console.error("❌ Quote fetch error:", quoteError);
  }

  if (!quoteData) {
    console.warn("⚠️ No quotes returned from DB");
  }

  const quote = quoteData ?? {
    quote: "Welcome back! Let's make today productive.",
    author: "GMF+"
  };

  return NextResponse.json({
    firstName: userData.first_name,
    quote: quote.quote,
    author: quote.author,
  });
}

