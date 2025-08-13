import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { FetchNews } from "./tools/fetchNews";
import { EmbedAndStore } from "./tools/embedAndStore";
import { ClusterTopics } from "./tools/clusterTopics";
import { ScoreSignals } from "./tools/scoreSignals";
import { DraftSnapshot } from "./tools/draftSnapshot";
import { computeConfidence } from "./confidence";
import { FetchSignals } from "./tools/fetchSignals";

export async function buildMarketSnapshot({ card, industry, ttl }: { card: string; industry: string; ttl: number }) {
  if (!supabaseAdmin) return;

  // 1) Pull fresh headlines
  const since = new Date();
  since.setHours(since.getHours() - 24);
  const articles = await FetchNews({ industry, sinceIso: since.toISOString() });

  // 2) Store + embed
  await EmbedAndStore(articles);

  // 3) Cluster + reason
  const themes = await ClusterTopics(articles);
  const structuredSignals = await FetchSignals({ industry });
  const cohort = null; // TODO: wire cohort metrics if available
  const scored = await ScoreSignals({ themes, cohort });

  const snapshot = DraftSnapshot({ card, industry, scored, cohort });

  // citations: top 8
  const sources = [
    ...articles.slice(0, 6).map(a => ({ title: a.title, url: a.url, source: a.source, published_at: a.published_at })),
    ...structuredSignals.sources.slice(0, 4)
  ];

  // compute confidence (placeholder inputs)
  const avgDays = articles.length
    ? articles.reduce((acc, a) => {
        const days = (Date.now() - new Date(a.published_at).getTime()) / (1000 * 60 * 60 * 24);
        return acc + days;
      }, 0) / articles.length
    : 14;
  const confidence = computeConfidence({
    sourceCount: sources.length,
    avgDaysOld: avgDays,
    divergencePenalty: scored.divergence_note ? 0.5 : 0,
    cohortAlignment: 0.5,
  });

  await supabaseAdmin
    .from('market_snapshots')
    .insert({
      card,
      industry,
      snapshot,
      sources,
      confidence,
      model_version: `${card}-agent-v1`,
      ttl_minutes: ttl,
      divergence_note: scored.divergence_note ?? null,
    });
}


