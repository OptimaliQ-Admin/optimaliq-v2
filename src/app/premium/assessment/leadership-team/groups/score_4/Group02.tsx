"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["talent_retention"] === "string" &&
    typeof answers["executive_communication"] === "string" &&
    typeof answers["leadership_bench_strength"] === "string" &&
    typeof answers["team_autonomy"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: talent_retention */}
      <MultipleChoiceQuestion
        question="How effective are your leaders at retaining top talent?"
        options={[
          { value: "high_turnover", label: "We lose many top performers" },
          { value: "moderate_retention", label: "Retention is okay but not consistent" },
          { value: "strong_retention", label: "We retain top talent with intention" },
          { value: "high_retention_culture", label: "Retention is part of our leadership culture" },
        ]}
        value={getStringAnswer(answers["talent_retention"])}
        onChange={(val) => onAnswer("talent_retention", val)}
      />

      {/* Question 5: executive_communication */}
      <MultipleChoiceQuestion
        question="How do executive leaders communicate with the broader company?"
        options={[
          { value: "only_through_managers", label: "Only through middle managers" },
          { value: "limited_visibility", label: "Occasional town halls or updates" },
          { value: "frequent_updates", label: "They provide regular company-wide updates" },
          { value: "transparent_accessibility", label: "They are accessible and transparent" },
        ]}
        value={getStringAnswer(answers["executive_communication"])}
        onChange={(val) => onAnswer("executive_communication", val)}
      />

      {/* Question 6: leadership_bench_strength */}
      <MultipleChoiceQuestion
        question="Do you have a strong leadership pipeline or succession plan?"
        options={[
          { value: "no_plan", label: "Not really — we address it case by case" },
          { value: "basic_identification", label: "We identify potential leaders informally" },
          { value: "development_programs", label: "We have some development programs" },
          { value: "succession_ready", label: "We have formal pipelines and backups in place" },
        ]}
        value={getStringAnswer(answers["leadership_bench_strength"])}
        onChange={(val) => onAnswer("leadership_bench_strength", val)}
      />

      {/* Question 7: team_autonomy */}
      <MultipleChoiceQuestion
        question="How much autonomy do team leads have to make decisions?"
        options={[
          { value: "very_limited", label: "Very limited — everything is escalated" },
          { value: "some_autonomy", label: "Some autonomy, but major decisions are top-down" },
          { value: "balanced_autonomy", label: "Leads have freedom within defined frameworks" },
          { value: "fully_empowered", label: "Leads are fully empowered and accountable" },
        ]}
        value={getStringAnswer(answers["team_autonomy"])}
        onChange={(val) => onAnswer("team_autonomy", val)}
      />
    </div>
  );
}
