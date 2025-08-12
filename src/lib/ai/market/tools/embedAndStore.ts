import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Article } from "./fetchNews";

export async function EmbedAndStore(articles: Article[]): Promise<number> {
  if (!supabaseAdmin || articles.length === 0) return 0;
  // TODO: generate embeddings and upsert; store without embeddings for now
  const rows = articles.map(a => ({
    industry: a.industry,
    source: a.source,
    title: a.title,
    url: a.url,
    published_at: a.published_at,
    summary: a.summary ?? null,
    sentiment: a.sentiment ?? null,
    entities: a.entities ?? null,
  }));
  await supabaseAdmin.from('market_articles').upsert(rows, { onConflict: 'industry,url_hash,published_at' });
  return rows.length;
}


