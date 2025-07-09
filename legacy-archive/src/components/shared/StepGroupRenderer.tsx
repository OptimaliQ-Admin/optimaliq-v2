"use client";

import React from "react";
import Group01_Goals from "@/app/premium/onboarding/initial-assessment/groups/Group01_Goals";
import Group02_Positioning from "@/app/premium/onboarding/initial-assessment/groups/Group02_Positioning";
import Group03_Operations from "@/app/premium/onboarding/initial-assessment/groups/Group03_Operations";
import Group04_GrowthStack from "@/app/premium/onboarding/initial-assessment/groups/Group04_GrowthStack";
import Group05_Clarity from "@/app/premium/onboarding/initial-assessment/groups/Group05_Clarity";
import Group06_Benchmarks from "@/app/premium/onboarding/initial-assessment/groups/Group06_Benchmarks";
import Group07_Final from "@/app/premium/onboarding/initial-assessment/groups/Group07_Final";
import Group08_BusinessOverview from "@/app/premium/onboarding/initial-assessment/groups/Group08_BusinessOverview";
import {
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  step: number;
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function StepGroupRenderer({ step, answers, onAnswer }: Props) {
  switch (step) {
    case 0:
      return <Group01_Goals answers={answers} onAnswer={onAnswer} />;
    case 1:
      return <Group02_Positioning answers={answers} onAnswer={onAnswer} />;
    case 2:
      return <Group03_Operations answers={answers} onAnswer={onAnswer} />;
    case 3:
      return <Group04_GrowthStack answers={answers} onAnswer={onAnswer} />;
    case 4:
      return <Group05_Clarity answers={answers} onAnswer={onAnswer} />;
    case 5:
      return <Group06_Benchmarks answers={answers} onAnswer={onAnswer} />;
    case 6:
      return <Group08_BusinessOverview answers={answers} onAnswer={onAnswer} />;
    case 7:
      return <Group07_Final answers={answers} onAnswer={onAnswer} />;
    default:
      return null;
  }
}
