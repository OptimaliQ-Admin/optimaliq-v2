export type ScoringEntry = {
  type: "multiple_choice" | "multi_select";
  weight: number;
  values: Record<string, number>;
};

export type ScoringBracket = Record<string, ScoringEntry>;

export type ScoringMap = Record<string, ScoringBracket>; 