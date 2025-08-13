import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Article } from "./fetchNews";
import { getEmbedding } from "@/lib/ai/embeddings";

export async function EmbedAndStore(articles: Article[]): Promise<number> {
  if (!supabaseAdmin || articles.length === 0) return 0;
  const rows: any[] = [];
  for (const a of articles) {
    const text = `${a.title}\n${a.summary || ''}`.trim();
    const embedding = await getEmbedding(text);
    rows.push({
      industry: a.industry,
      source: a.source,
      title: a.title,
      url: a.url,
      published_at: a.published_at,
      summary: a.summary ?? null,
      sentiment: a.sentiment ?? null,
      entities: a.entities ?? null,
      embedding,
    });
  }
  await supabaseAdmin.from('market_articles').upsert(rows, { onConflict: 'industry,url_hash,published_at' });
  return rows.length;
}


