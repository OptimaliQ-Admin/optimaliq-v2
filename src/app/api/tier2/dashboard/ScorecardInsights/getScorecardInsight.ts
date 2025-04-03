import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { category, industry, score_min, score_max } = await req.json();

  if (!category || !industry || score_min === undefined || score_max === undefined) {
    return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('scorecard_insights')
    .select('title, description, benchmark, focus_areas')
    .eq('category', category)
    .eq('industry', industry)
    .eq('score_min', score_min)
    .eq('score_max', score_max)
    .single();

  if (error || !data) {
    console.error('❌ Failed to fetch insight:', error);
    return NextResponse.json({ error: 'Insight not found.' }, { status: 404 });
  }

  return NextResponse.json(data);
}