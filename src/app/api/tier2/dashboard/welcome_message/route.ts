import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { user_id } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // Fetch user's first name using user_id
  const { data: userData, error: userError } = await supabase
    .from('tier2_users')
    .select('first_name')
    .eq('user_id', user_id)
    .single();

  if (userError || !userData) {
    console.error("❌ User lookup failed:", userError);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // ✅ Fetch a random quote
  const { data: quoteData, error: quoteError } = await supabase
    .rpc<any, void>('get_random_quote')
    .single();

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
