"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["team_digital_skills"] === "string" &&
    typeof answers["data_visibility"] === "string" &&
    typeof answers["tool_fragmentation"] === "string" &&
    typeof answers["alignment_efficiency"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How would you rate your team’s digital skill set?"
        options={[
          { value: "very_low", label: "Very low — we avoid using new tools" },
          { value: "basic", label: "Basic — we rely on common tools but struggle with more advanced ones" },
          { value: "functional", label: "Functional — most people can navigate modern systems" },
          { value: "proficient", label: "Proficient — we are confident with modern digital tools" },
        ]}
        value={getStringAnswer(answers["team_digital_skills"])}
        onChange={(val) => onAnswer("team_digital_skills", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="Do you have visibility into how different tools or platforms are being used?"
        options={[
          { value: "no_visibility", label: "No visibility" },
          { value: "anecdotal_only", label: "Only anecdotal or ad hoc understanding" },
          { value: "occasional_reports", label: "Occasional reports or usage checks" },
          { value: "centralized_dashboard", label: "Yes, we have centralized dashboards or monitoring" },
        ]}
        value={getStringAnswer(answers["data_visibility"])}
        onChange={(val) => onAnswer("data_visibility", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How connected or fragmented is your tech stack?"
        options={[
          { value: "completely_fragmented", label: "Completely fragmented — nothing talks to anything" },
          { value: "some_integrations", label: "Some tools are loosely integrated" },
          { value: "most_integrated", label: "Most of our core tools are integrated" },
          { value: "fully_connected", label: "Fully connected — data flows across systems" },
        ]}
        value={getStringAnswer(answers["tool_fragmentation"])}
        onChange={(val) => onAnswer("tool_fragmentation", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="Do your current tools support efficient cross-team collaboration?"
        options={[
          { value: "not_at_all", label: "Not at all — most work in silos" },
          { value: "partially", label: "Partially — some collaboration happens, but it’s clunky" },
          { value: "mostly", label: "Mostly — our teams work together fairly well using tools" },
          { value: "completely", label: "Completely — our tools are built for collaboration" },
        ]}
        value={getStringAnswer(answers["alignment_efficiency"])}
        onChange={(val) => onAnswer("alignment_efficiency", val)}
      />
    </div>
  );
}
