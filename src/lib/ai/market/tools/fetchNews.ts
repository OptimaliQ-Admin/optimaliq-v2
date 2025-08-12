export interface Article {
  industry: string;
  source: string;
  title: string;
  url: string;
  published_at: string; // ISO
  summary?: string;
  sentiment?: number; // -1..1
  entities?: Record<string, any>;
}

export async function FetchNews(params: { industry: string; sinceIso: string }): Promise<Article[]> {
  // TODO: integrate providers (Finnhub, NewsAPI). For now return empty to keep pipeline safe.
  return [];
}


