import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeIndustry } from "@/lib/utils/industry";

type CardType = 'market_signals' | 'business_trends' | 'engagement_intel';

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    const body = await req.json().catch(() => ({}));
    const card = (body.card as CardType) || 'market_signals';
    const industry = normalizeIndustry(body.industry || 'technology');

    // Read latest two snapshots for comparison
    const { data: rows } = await supabaseAdmin
      .from('market_snapshots')
      .select('id, snapshot, created_at')
      .eq('card', card)
      .eq('industry', industry)
      .order('created_at', { ascending: false })
      .limit(2);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ applicable: false, reason: 'no_snapshot' });
    }

    const latest = rows[0]?.snapshot as any;
    const prev = rows[1]?.snapshot as any | undefined;

    let trigger = '';
    // Heuristics per card
    if (card === 'market_signals') {
      const currSent = Number(latest?.sentiment?.score ?? latest?.data?.sentiment?.score);
      const prevSent = Number(prev?.sentiment?.score ?? prev?.data?.sentiment?.score);
      const drop = isFinite(currSent) && isFinite(prevSent) ? prevSent - currSent : 0;
      const growthTrend = (latest?.growthRate?.trend ?? latest?.data?.growthRate?.trend)?.toString();
      if (drop >= 10) trigger = 'sentiment_drop';
      if (!trigger && (growthTrend === 'down' || growthTrend === '-')) trigger = 'growth_down';
    } else if (card === 'business_trends') {
      const trends = (latest?.trends ?? latest?.data?.trends) as Array<any> | undefined;
      const anyDown = trends?.some(t => (t.direction || '').toString() === 'down');
      if (anyDown) trigger = 'trend_down';
    } else if (card === 'engagement_intel') {
      const score = Number(latest?.signalScore ?? latest?.data?.signalScore);
      const prevScore = Number(prev?.signalScore ?? prev?.data?.signalScore);
      const drop = isFinite(score) && isFinite(prevScore) ? prevScore - score : 0;
      if (drop >= 10) trigger = 'signal_drop';
    }

    if (!trigger) {
      return NextResponse.json({ applicable: false, reason: 'no_trigger' });
    }

    // Minimal lever suggestion template
    const lever = {
      title: 'Stabilize near-term momentum',
      action: trigger === 'growth_down' ? 'Shift 15% budget to top-performing organic channel and ramp content cadence.' : 'Launch rapid retention sprint for at-risk segments and tighten ICP targeting in paid.',
      metric: trigger === 'trend_down' ? 'Lead-to-opportunity conversion' : 'Engagement signal score',
      target: trigger === 'growth_down' ? '+15% organic sessions in 30 days' : '+10 pts in 30 days',
      due_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      ownerHint: 'Growth lead',
      reason: `Proposed due to ${trigger.replace('_', ' ')} in ${industry}.`,
      confidence: 0.6,
    };

    return NextResponse.json({ applicable: true, lever });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to propose lever' }, { status: 500 });
  }
}


