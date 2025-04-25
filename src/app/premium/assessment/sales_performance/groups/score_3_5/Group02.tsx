"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_05b3d7"] === "string" &&
    typeof answers["how_5d49b3"] === "string" &&
    typeof answers["how_b650ca"] === "string" &&
    typeof answers["how_152df3"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: how_05b3d7 */}
      <MultipleChoiceQuestion
        question="How do you identify pipeline coverage gaps before they affect targets?"
        options={[
          { value: "too_late", label: "We don’t look until it’s too late" },
          { value: "manual_monitoring", label: "Managers monitor activity and aging" },
          { value: "dashboards", label: "We use dashboards or CRM reports" },
          { value: "modeled_by_stage", label: "Coverage is monitored proactively and modeled by stage" },
        ]}
        value={getStringAnswer(answers["how_05b3d7"])}
        onChange={(val) => onAnswer("how_05b3d7", val)}
      />

      {/* Question 5: how_5d49b3 */}
      <MultipleChoiceQuestion
        question="How do you track deal quality (fit, velocity, engagement)?"
        options={[
          { value: "gut", label: "We rely on gut feel or notes" },
          { value: "call_history", label: "We look at call history or deal size" },
          { value: "lead_fit", label: "We use scoring or lead fit logic" },
          { value: "multi_factor", label: "We use multi-factor scoring and sales insights tools" },
        ]}
        value={getStringAnswer(answers["how_5d49b3"])}
        onChange={(val) => onAnswer("how_5d49b3", val)}
      />

      {/* Question 6: how_b650ca */}
      <MultipleChoiceQuestion
        question="How are your most successful sales behaviors shared or replicated across the team?"
        options={[
          { value: "not_shared", label: "They’re not — it varies by rep" },
          { value: "tips_informal", label: "Top reps share tips informally" },
          { value: "best_practice_reviews", label: "We run playbook or best-practice reviews" },
          { value: "documented_and_trained", label: "Top plays and behaviors are documented, trained, and tracked" },
        ]}
        value={getStringAnswer(answers["how_b650ca"])}
        onChange={(val) => onAnswer("how_b650ca", val)}
      />

      {/* Question 7: how_152df3 */}
      <MultipleChoiceQuestion
        question="How often do you run sales pipeline or forecast health reviews?"
        options={[
          { value: "occasionally", label: "Occasionally or when things slow down" },
          { value: "monthly", label: "Monthly" },
          { value: "weekly", label: "Weekly" },
          { value: "operating_cadence", label: "Part of a structured weekly operating cadence" },
        ]}
        value={getStringAnswer(answers["how_152df3"])}
        onChange={(val) => onAnswer("how_152df3", val)}
      />
    </div>
  );
}
