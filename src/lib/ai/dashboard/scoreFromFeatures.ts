import { OnboardingFeatures } from "./buildFeatures";

export interface Scores {
  strategy_score: number;
  process_score: number;
  technology_score: number;
  score: number;
  confidence: number; // 0-1
  explanations: {
    strategy: string;
    process: string;
    technology: string;
  };
}

// Deterministic rubric mapping features → scores. Serves as a guardrail or fallback.
export function scoreFromFeatures(features: OnboardingFeatures): Scores {
  // Base scores
  let process = Math.min(5, Math.max(1, features.processMaturityLevel));
  let technology = Math.min(5, Math.max(1, features.techMaturityLevel));

  // Strategy approximated from alignment + decision discipline
  let strategy = Math.min(5, Math.max(1, (features.alignmentLevel + features.decisionDisciplineLevel) / 2));

  // Penalties
  if (features.hasAdHocProcesses) process = Math.min(process, 2.2);
  if (features.hasFundingConstraints) strategy = Math.max(1.5, strategy - 0.3);
  if (features.hasBrandPositioningGap) strategy = Math.max(1.5, strategy - 0.2);

  // Channel/tool breadth nudges tech/process slightly
  if (features.channelsCount <= 1) strategy = Math.max(1, strategy - 0.1);
  if (features.toolsCount <= 1) technology = Math.max(1, technology - 0.1);

  const overall = parseFloat(((strategy + process + technology) / 3).toFixed(2));

  const explanations = {
    strategy: `Based on alignment (${features.alignmentLevel}) and decision discipline (${features.decisionDisciplineLevel})` +
      (features.hasBrandPositioningGap ? ", brand positioning gap detected" : "") +
      (features.hasFundingConstraints ? ", funding constraints present" : ""),
    process: `Process maturity mapped to ${features.processMaturityLevel}` +
      (features.hasAdHocProcesses ? ", ad hoc processes cap applied" : ""),
    technology: `Tech maturity mapped to ${features.techMaturityLevel}` +
      (features.toolsCount <= 1 ? ", limited stack breadth" : ""),
  };

  // Confidence heuristic: lower if ad hoc/funding gaps present
  const penalties = [features.hasAdHocProcesses, features.hasFundingConstraints].filter(Boolean).length;
  const confidence = Math.max(0.5, 1 - penalties * 0.15);

  return {
    strategy_score: parseFloat(strategy.toFixed(2)),
    process_score: parseFloat(process.toFixed(2)),
    technology_score: parseFloat(technology.toFixed(2)),
    score: overall,
    confidence: parseFloat(confidence.toFixed(2)),
    explanations,
  };
}


