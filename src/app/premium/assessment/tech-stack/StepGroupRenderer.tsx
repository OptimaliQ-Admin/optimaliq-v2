"use client";

import React from "react";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

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

// Final Tools Step
import Group04 from "./groups/Group04";

function normalizeScore(score: number): string {
  if (score >= 1 && score <= 1.4) return "score_1";
  if (score >= 1.5 && score <= 1.9) return "score_1_5";
  if (score >= 2 && score <= 2.4) return "score_2";
  if (score >= 2.5 && score <= 2.9) return "score_2_5";
  if (score >= 3 && score <= 3.4) return "score_3";
  if (score >= 3.5 && score <= 3.9) return "score_3_5";
  if (score >= 4 && score <= 4.4) return "score_4";
  if (score >= 4.5 && score <= 4.9) return "score_4_5";
  return "score_5";
}

type Props = {
  step: number;
  score: number;
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: any) => void;
};

export default function StepGroupRenderer({ step, score, answers, onAnswer }: Props) {
  const normalized = normalizeScore(score);

  const CurrentStep = {
    score_1: [Score1_Step01, Score1_Step02, Score1_Step03, Group04],
    score_1_5: [Score1_5_Step01, Score1_5_Step02, Score1_5_Step03, Group04],
    score_2: [Score2_Step01, Score2_Step02, Group04],
    score_2_5: [Score2_5_Step01, Score2_5_Step02, Score2_5_Step03, Group04],
    score_3: [Score3_Step01, Score3_Step02, Score3_Step03, Group04],
    score_3_5: [Score3_5_Step01, Score3_5_Step02, Score3_5_Step03, Group04],
    score_4: [Score4_Step01, Score4_Step02, Score4_Step03, Group04],
    score_4_5: [Score4_5_Step01, Score4_5_Step02, Score4_5_Step03, Group04],
    score_5: [Score5_Step01, Score5_Step02, Score5_Step03, Group04],
  }[normalized]?.[step];

  if (!CurrentStep) {
    return <div>Invalid score or step</div>;
  }

  return <CurrentStep answers={answers} onAnswer={onAnswer} />;
} 