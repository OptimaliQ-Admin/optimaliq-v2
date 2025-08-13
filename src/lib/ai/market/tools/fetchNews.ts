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

function computeSentiment(text: string): number {
  // Simple lexicon-based fallback sentiment [-1,1]
  const pos = (text.match(/(growth|beat|surge|record|win|positive|up)/gi) || []).length;
  const neg = (text.match(/(decline|miss|drop|risk|negative|down)/gi) || []).length;
  const score = pos - neg;
  if (score === 0) return 0;
  const norm = Math.max(-1, Math.min(1, score / 5));
  return Number(norm.toFixed(2));
}

export async function FetchNews(params: { industry: string; sinceIso: string }): Promise<Article[]> {
  const { industry, sinceIso } = params;
  const out: Article[] = [];

  // NewsAPI
  try {
    if (process.env.NEWSAPI_KEY) {
      const q = encodeURIComponent(industry);
      const url = `https://newsapi.org/v2/everything?q=${q}&from=${sinceIso}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${process.env.NEWSAPI_KEY}`;
      const res = await fetch(url);
      const json: any = await res.json();
      const articles = Array.isArray(json.articles) ? json.articles : [];
      for (const a of articles) {
        if (!a?.title || !a?.url || !a?.publishedAt) continue;
        const summary = a?.description || a?.content || '';
        out.push({
          industry,
          source: 'newsapi',
          title: a.title,
          url: a.url,
          published_at: new Date(a.publishedAt).toISOString(),
          summary,
          sentiment: computeSentiment(`${a.title} ${summary}`),
          entities: { source: a.source?.name || null },
        });
      }
    }
  } catch {}

  // Alpha Vantage News & Sentiment (if available)
  try {
    if (process.env.ALPHA_VANTAGE_API_KEY) {
      const functionName = 'NEWS_SENTIMENT';
      const tickers = '';
      const url = `https://www.alphavantage.co/query?function=${functionName}&tickers=${tickers}&topics=${encodeURIComponent(industry)}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
      const res = await fetch(url);
      const json: any = await res.json();
      const feed = Array.isArray(json.feed) ? json.feed : [];
      for (const f of feed) {
        const title = f.title || f.headline;
        const url = f.url || f.url_overridden_by_dest || f.source || '';
        const time = f.time_published ? new Date(f.time_published).toISOString() : new Date().toISOString();
        if (!title || !url) continue;
        const summary = f.summary || f.overall_sentiment_label || '';
        out.push({
          industry,
          source: 'alpha_vantage',
          title,
          url,
          published_at: time,
          summary,
          sentiment: typeof f.overall_sentiment_score === 'number' ? Math.max(-1, Math.min(1, f.overall_sentiment_score / 5)) : computeSentiment(`${title} ${summary}`),
          entities: { topics: f.topics || [] },
        });
      }
    }
  } catch {}

  // Finnhub Company/sector news (fallback generic)
  try {
    if (process.env.FINNHUB_API_KEY) {
      const now = new Date();
      const from = new Date(sinceIso);
      const symbol = '';
      const url = `https://finnhub.io/api/v1/news?category=${encodeURIComponent(industry)}&from=${from.toISOString().slice(0,10)}&to=${now.toISOString().slice(0,10)}&token=${process.env.FINNHUB_API_KEY}`;
      const res = await fetch(url);
      const json: any = await res.json();
      const items = Array.isArray(json) ? json : [];
      for (const it of items) {
        if (!it?.headline || !it?.url || !it?.datetime) continue;
        out.push({
          industry,
          source: 'finnhub',
          title: it.headline,
          url: it.url,
          published_at: new Date(it.datetime * 1000).toISOString(),
          summary: it.summary || '',
          sentiment: computeSentiment(`${it.headline} ${it.summary || ''}`),
          entities: { category: industry },
        });
      }
    }
  } catch {}

  return out;
}


