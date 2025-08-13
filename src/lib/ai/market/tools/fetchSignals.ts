export interface SignalPack {
  growthMomentum: number | null;
  sentimentScore: number | null;
  competitionPressure: number | null;
  capitalFlow: number | null;
  hiringIndex?: number | null;
  searchIndex?: number | null;
  priceIndex?: number | null;
  sources: Array<{ title?: string; url?: string; source?: string; observed_at?: string }>;
}

export async function FetchSignals({ industry }: { industry: string }): Promise<SignalPack> {
  // TODO: integrate ETFs, FRED, Google Trends, jobs, etc.
  return {
    growthMomentum: null,
    sentimentScore: null,
    competitionPressure: null,
    capitalFlow: null,
    hiringIndex: null,
    searchIndex: null,
    priceIndex: null,
    sources: [],
  };
}


