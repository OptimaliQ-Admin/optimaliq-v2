export interface Benchmarks {
  strategy: string;
  process: string;
  technology: string;
}

export function benchmarkFromScores(scores: { strategy_score: number; process_score: number; technology_score: number; }, industry: string): Benchmarks {
  const s = scores.strategy_score, p = scores.process_score, t = scores.technology_score;
  const band = (x: number) => x >= 4 ? "advanced" : x >= 3 ? "developing" : "early";
  return {
    strategy: `Strategy is ${band(s)} for ${industry}; focus on positioning and execution clarity.`,
    process: `Processes are ${band(p)}; formalize SOPs and instrumentation to mature.`,
    technology: `Technology is ${band(t)}; improve integrations and automation depth.`,
  };
}


