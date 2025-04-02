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
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Fetch a random inspirational quote
  const { data: quoteData, error: quoteError } = await supabase
    .from('inspirational_quotes')
    .select('quote, author')
    .order('random()')
    .limit(1)
    .single();

  const quote = quoteError || !quoteData
    ? { quote: "Welcome back! Let's make today productive.", author: "GMF+" }
    : quoteData;

  return NextResponse.json({
    firstName: userData.first_name,
    quote: quote.quote,
    author: quote.author,
  });
}
