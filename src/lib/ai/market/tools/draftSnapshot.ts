import { ScoredSignals } from "./scoreSignals";

export function DraftSnapshot(params: { card: string; industry: string; scored: ScoredSignals; cohort?: any }) {
  const { card, industry, scored } = params;
  if (card === 'market_signals') {
    return {
      marketSize: { value: scored.marketSize.value, growth: scored.marketSize.growth, currency: 'USD', description: scored.marketSize.description || '' },
      growthRate: { value: scored.growthRate.value, trend: scored.growthRate.trend, period: scored.growthRate.period || 'annual', description: '' },
      competition: { level: 'Medium', trend: 'Stable', description: '', details: '' },
      sentiment: { score: scored.sentiment.score, trend: scored.sentiment.trend, factors: scored.sentiment.factors || [], description: scored.sentiment.description || '' },
      fullInsight: `Market outlook for ${industry}`,
      dataSources: { finnhub: true, alpha_vantage: true, news_api: true },
      confidenceScore: scored.confidence,
      aiModelVersion: 'ms-agent-v1',
    };
  }
  if (card === 'business_trends') {
    return {
      trends: [
        { title: 'Theme momentum', direction: 'up', percentageChange: 3.0, description: 'Aggregated theme momentum', industry, aiModelVersion: 'bt-agent-v1' },
      ],
      userTier: 'premium',
      industry,
      generatedAt: new Date().toISOString(),
    };
  }
  // engagement_intel default
  return {
    industry,
    lastUpdated: new Date().toISOString(),
    signalScore: Math.round(params.scored.sentiment.score),
    signalSummary: 'Auto-drafted summary',
    trends: [
      { title: 'Email engagement', description: 'Stable', direction: 'flat', percentageChange: 0 },
    ],
    recommendations: [],
  };
}


