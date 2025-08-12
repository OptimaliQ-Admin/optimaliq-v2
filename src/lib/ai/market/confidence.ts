export interface ConfidenceInputs {
  sourceCount: number;            // number of distinct citations considered
  avgDaysOld: number;             // average article age in days
  divergencePenalty: number;      // 0..0.5 where 0 means no conflicts
  cohortAlignment: number;        // 0..1 agreement with cohort deltas
}

export function computeConfidence(inputs: ConfidenceInputs): number {
  const cappedSource = Math.min(inputs.sourceCount, 8) / 8;           // 0..1
  const recency = Math.max(0, Math.min(1, 1 - inputs.avgDaysOld / 14));
  const divergence = Math.max(0, Math.min(1, 1 - inputs.divergencePenalty));
  const alignment = Math.max(0, Math.min(1, inputs.cohortAlignment));
  const score = 0.25 * cappedSource + 0.25 * recency + 0.25 * divergence + 0.25 * alignment;
  return Math.max(0, Math.min(1, score));
}


