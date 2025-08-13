import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { normalizeIndustry } from '@/lib/utils/industry';
import { getSectorETFSymbol } from '@/lib/signals/industryMap';
import { fetchDailyAdjusted, computeMomentum } from '@/lib/signals/alphaVantage';

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    const body = await req.json().catch(() => ({}));
    const industry = normalizeIndustry(body.industry || 'technology');
    const observedOn = new Date().toISOString().slice(0, 10);

    // Sector ETF momentum as proxy for growthMomentum
    const etf = getSectorETFSymbol(industry) || 'XLK';
    const closes = await fetchDailyAdjusted(etf);
    const growthMomentum = computeMomentum(closes);

    const row = {
      industry,
      observed_on: observedOn,
      growth_momentum: growthMomentum,
      sentiment_score: null,
      competition_pressure: null,
      capital_flow: null,
      hiring_index: null,
      search_index: null,
      price_index: null,
      sources: [{ source: 'alpha_vantage', title: `${etf} 30d momentum`, observed_at: new Date().toISOString() }],
    } as any;

    await supabaseAdmin.from('signals_daily').upsert(row, { onConflict: 'industry,observed_on' });

    return NextResponse.json({ ok: true, data: row });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to compute signals' }, { status: 500 });
  }
}


