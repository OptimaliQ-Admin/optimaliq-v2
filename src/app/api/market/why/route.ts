import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeIndustry } from "@/lib/utils/industry";
import { getEmbedding } from "@/lib/ai/embeddings";

// Minimal RAG stub: fetch recent articles and return top N URLs/snippets. Replace with vector search later.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = normalizeIndustry(searchParams.get("industry") ?? "technology");
    const q = (searchParams.get("q") ?? "").trim();
    const k = Math.max(1, Math.min(6, parseInt(searchParams.get("k") ?? "6", 10)));

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    // Last 30 days filter
    const since = new Date();
    since.setDate(since.getDate() - 30);

    // Vector RAG if we have a query
    if (q) {
      const queryEmbedding = await getEmbedding(q);
      if (queryEmbedding) {
        // pgvector search
        const { data: vecRows, error: vecErr } = await supabaseAdmin.rpc('match_market_articles', {
          q_industry: industry,
          q_since: since.toISOString(),
          q_embedding: queryEmbedding,
          q_limit: k,
        });
        if (!vecErr && Array.isArray(vecRows)) {
          return NextResponse.json({ query: q, citations: vecRows });
        }
      }
    }

    // Fallback: recent by time
    const { data, error } = await supabaseAdmin
      .from("market_articles")
      .select("title,url,source,published_at,summary")
      .eq("industry", industry)
      .gte("published_at", since.toISOString())
      .order("published_at", { ascending: false })
      .limit(k);

    if (error) return NextResponse.json({ error: "Failed to search articles" }, { status: 500 });
    return NextResponse.json({ query: q, citations: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to answer why" }, { status: 500 });
  }
}


