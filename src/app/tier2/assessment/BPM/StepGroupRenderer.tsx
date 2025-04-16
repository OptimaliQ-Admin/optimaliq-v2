"use client";

import React from "react";

// Score 1.0 Group
import Score1_Step01 from "./groups/score_1/Group01";
import Score1_Step02 from "./groups/score_1/Group02";
import Score1_Step03 from "./groups/score_1/Group03";

// Score 1.5 Group
import Score1_5_Step01 from "./groups/score_1_5/Group01";
import Score1_5_Step02 from "./groups/score_1_5/Group02";
import Score1_5_Step03 from "./groups/score_1_5/Group03";

// Score 2.0 Group
import Score2_Step01 from "./groups/score_2/Group01";
import Score2_Step02 from "./groups/score_2/Group02";
import Score2_Step03 from "./groups/score_2/Group03";


// Score 2.5 Group
import Score2_5_Step01 from "./groups/score_2_5/Group01";
import Score2_5_Step02 from "./groups/score_2_5/Group02";
import Score2_5_Step03 from "./groups/score_2_5/Group03";

// Score 3.0 Group
import Score3_Step01 from "./groups/score_3/Group01";
import Score3_Step02 from "./groups/score_3/Group02";
import Score3_Step03 from "./groups/score_3/Group03";

// Score 3.5 Group
import Score3_5_Step01 from "./groups/score_3_5/Group01";
import Score3_5_Step02 from "./groups/score_3_5/Group02";
import Score3_5_Step03 from "./groups/score_3_5/Group03";

// Score 4.0 Group
import Score4_Step01 from "./groups/score_4/Group01";
import Score4_Step02 from "./groups/score_4/Group02";
import Score4_Step03 from "./groups/score_4/Group03";

// Score 4.5 Group
import Score4_5_Step01 from "./groups/score_4_5/Group01";
import Score4_5_Step02 from "./groups/score_4_5/Group02";
import Score4_5_Step03 from "./groups/score_4_5/Group03";

// Score 5.0 Group
import Score5_Step01 from "./groups/score_5/Group01";
import Score5_Step02 from "./groups/score_5/Group02";
import Score5_Step03 from "./groups/score_5/Group03";

type Props = {
  step: number;
  score: number;
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function StepGroupRenderer({ step, score, answers, onAnswer }: Props) {
  const normalizedScore = normalizeScore(score);

  const stepGroups: Record<string, React.ComponentType<any>[]> = {
    Score_1: [Score1_Step01, Score1_Step02, Score1_Step03],
  Score_1_5: [Score1_5_Step01, Score1_5_Step02, Score1_5_Step03],
  Score_2: [Score2_Step01, Score2_Step02, Score2_Step03],
  Score_2_5: [Score2_5_Step01, Score2_5_Step02, Score2_5_Step03],
  Score_3: [Score3_Step01, Score3_Step02, Score3_Step03],
  Score_3_5: [Score3_5_Step01, Score3_5_Step02, Score3_5_Step03],
  Score_4: [Score4_Step01, Score4_Step02, Score4_Step03],
  Score_4_5: [Score4_5_Step01, Score4_5_Step02, Score4_5_Step03],
  Score_5: [Score5_Step01, Score5_Step02, Score5_Step03],
  };

  const group = stepGroups[normalizedScore];
  const StepComponent = group?.[step];

  if (!StepComponent) return null;

  return <StepComponent answers={answers} onAnswer={onAnswer} />;
}

function normalizeScore(score: number): string {
  if(score >= 1 && score <= 1.4) return "Score_1";
  if (score >= 1.5 && score <= 1.9) return "Score_1_5";
  if (score >= 2 && score <= 2.4) return "Score_2";
  if (score >= 2.5 && score <= 2.9) return "Score_2_5";
  if (score >= 3 && score <= 3.4) return "Score_3";
  if (score >= 3.5 && score <= 3.9) return "Score_3_5";
  if (score >= 4 && score <= 4.4) return "Score_4";
  if (score >= 4.5 && score <= 4.9) return "Score_4_5";
  return "Score_5";
}
