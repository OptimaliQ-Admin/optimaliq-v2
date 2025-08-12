import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { buildMarketSnapshot } from "@/lib/ai/market/agent";

async function buildSnapshot(card: string, industry: string): Promise<void> {
  const ttl = 360;
  await buildMarketSnapshot({ card, industry, ttl });
}

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

    // Fetch up to N queued requests
    const { data: queued } = await supabaseAdmin
      .from('snapshot_refresh_requests')
      .select('*')
      .eq('status', 'queued')
      .order('requested_at', { ascending: true })
      .limit(5);

    if (!queued || queued.length === 0) {
      return NextResponse.json({ drained: 0 });
    }

    for (const job of queued) {
      await supabaseAdmin
        .from('snapshot_refresh_requests')
        .update({ status: 'running' })
        .eq('id', job.id);
      try {
        await buildSnapshot(job.card, job.industry);
        await supabaseAdmin
          .from('snapshot_refresh_requests')
          .update({ status: 'done' })
          .eq('id', job.id);
      } catch (e) {
        await supabaseAdmin
          .from('snapshot_refresh_requests')
          .update({ status: 'error' })
          .eq('id', job.id);
      }
    }

    return NextResponse.json({ drained: queued.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to drain queue' }, { status: 500 });
  }
}


