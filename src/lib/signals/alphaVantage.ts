export interface DailyClose { date: string; close: number }

export async function fetchDailyAdjusted(symbol: string): Promise<DailyClose[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return [];
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${apiKey}`;
  const res = await fetch(url);
  const json: any = await res.json();
  const series = json['Time Series (Daily)'] || {};
  const rows: DailyClose[] = Object.keys(series).slice(0, 30).map(d => ({ date: d, close: Number(series[d]['4. close']) }))
    .filter(r => !isNaN(r.close))
    .sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

export function computeMomentum(closes: DailyClose[]): number | null {
  if (!closes || closes.length < 5) return null;
  const first = closes[0].close;
  const last = closes[closes.length - 1].close;
  if (!first || !last) return null;
  const changePct = ((last - first) / first) * 100;
  const score = Math.max(0, Math.min(100, 50 + changePct));
  return Number(score.toFixed(1));
}


