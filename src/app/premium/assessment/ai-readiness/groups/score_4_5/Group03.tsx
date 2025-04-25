"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_model_monitoring"] === "string" &&
    typeof answers["ai_skill_development"] === "string" &&
    typeof answers["ai_innovation"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_model_monitoring */}
      <MultipleChoiceQuestion
        question="How do you monitor AI models once they are deployed?"
        options={[
          { value: "no_monitoring", label: "We don’t monitor them post-launch" },
          { value: "basic_monitoring", label: "Basic performance checks occasionally" },
          { value: "structured_reviews", label: "Structured reviews and alerts for drift or errors" },
          { value: "continuous_monitoring", label: "Continuous monitoring with dashboards and alerts" },
        ]}
        value={getStringAnswer(answers["ai_model_monitoring"])}
        onChange={(val) => onAnswer("ai_model_monitoring", val)}
      />

      {/* Question 9: ai_skill_development */}
      <MultipleChoiceQuestion
        question="How are you developing AI-related skills across your workforce?"
        options={[
          { value: "no_training", label: "We don’t offer formal training" },
          { value: "occasional_training", label: "Occasional workshops or vendor training" },
          { value: "internal_programs", label: "Internal programs for specific roles or teams" },
          { value: "org_wide_enablement", label: "Ongoing org-wide enablement with certifications or learning paths" },
        ]}
        value={getStringAnswer(answers["ai_skill_development"])}
        onChange={(val) => onAnswer("ai_skill_development", val)}
      />

      {/* Question 10: ai_innovation */}
      <MultipleChoiceQuestion
        question="How would you describe your culture of innovation when it comes to AI?"
        options={[
          { value: "risk_averse", label: "We’re risk averse and wait for others to adopt first" },
          { value: "testing_waters", label: "We’re testing the waters with cautious experimentation" },
          { value: "proactive", label: "We proactively explore and trial new AI capabilities" },
          { value: "innovation_leader", label: "We are seen as an innovation leader in our space" },
        ]}
        value={getStringAnswer(answers["ai_innovation"])}
        onChange={(val) => onAnswer("ai_innovation", val)}
      />
    </div>
  );
}
