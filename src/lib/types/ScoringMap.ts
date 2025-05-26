export type ScoringEntry = {
  type: "multiple_choice" | "multi_select" | "text_area";
  weight: number;
  values: Record<string, number>;
};

export type ScoringBracket = Record<string, ScoringEntry>;

export type ScoringMap = Record<string, ScoringBracket>; 