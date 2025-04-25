"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["competitive_insights_usage"] === "string" &&
    typeof answers["team_involvement"] === "string" &&
    typeof answers["internal_comparison"] === "string" &&
    typeof answers["benchmarking_rigor"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How are competitive or benchmarking insights used in your business today?"
        options={[
          { value: "not_used", label: "They’re not really used" },
          { value: "informal_decisions", label: "They sometimes inform decisions" },
          { value: "inform_strategy", label: "They directly inform strategy and plans" },
          { value: "integrated", label: "They are integrated into core decision-making" },
        ]}
        value={getStringAnswer(answers["competitive_insights_usage"])}
        onChange={(val) => onAnswer("competitive_insights_usage", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="Who is responsible for analyzing or acting on competitive benchmarking data?"
        options={[
          { value: "nobody", label: "No one specifically" },
          { value: "individuals", label: "Individual contributors or ad hoc teams" },
          { value: "team_leads", label: "Team leads or department heads" },
          { value: "dedicated_team", label: "We have a dedicated strategy or insights team" },
        ]}
        value={getStringAnswer(answers["team_involvement"])}
        onChange={(val) => onAnswer("team_involvement", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How often do you compare internal performance across teams or business units?"
        options={[
          { value: "never", label: "Never — we don’t look at internal benchmarking" },
          { value: "sometimes", label: "Sometimes — when issues arise" },
          { value: "regularly", label: "Regularly as part of reviews" },
          { value: "consistently", label: "Consistently — it’s part of our operating model" },
        ]}
        value={getStringAnswer(answers["internal_comparison"])}
        onChange={(val) => onAnswer("internal_comparison", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How would you describe the rigor of your benchmarking process?"
        options={[
          { value: "casual", label: "Casual — we review a few stats or metrics" },
          { value: "moderate", label: "Moderate — we apply some structure and analysis" },
          { value: "high", label: "High — we use a defined methodology and deep dives" },
          { value: "advanced", label: "Advanced — we combine internal and external benchmarks for insights" },
        ]}
        value={getStringAnswer(answers["benchmarking_rigor"])}
        onChange={(val) => onAnswer("benchmarking_rigor", val)}
      />
    </div>
  );
}
