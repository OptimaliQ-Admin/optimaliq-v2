"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_budget"] === "string" &&
    typeof answers["data_accessibility"] === "string" &&
    typeof answers["tool_readiness"] === "string" &&
    typeof answers["ai_ethics"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: ai_budget */}
      <MultipleChoiceQuestion
        question="How would you describe your current AI budget or resource allocation?"
        options={[
          { value: "none", label: "We have no dedicated budget or resources" },
          { value: "ad_hoc", label: "Ad hoc — pulled from existing teams or initiatives" },
          { value: "initial_funding", label: "We’ve allocated initial funding for AI projects" },
          { value: "dedicated_investment", label: "We have a dedicated AI budget and roadmap" },
        ]}
        value={getStringAnswer(answers["ai_budget"])}
        onChange={(val) => onAnswer("ai_budget", val)}
      />

      {/* Question 5: data_accessibility */}
      <MultipleChoiceQuestion
        question="How accessible is the data you’d need to train or run AI models?"
        options={[
          { value: "data_silos", label: "Our data is siloed or hard to access" },
          { value: "some_access", label: "We can access some useful datasets" },
          { value: "well_structured", label: "Most data is well-structured and accessible" },
          { value: "ai_ready", label: "Our data is AI-ready — structured, labeled, and accessible" },
        ]}
        value={getStringAnswer(answers["data_accessibility"])}
        onChange={(val) => onAnswer("data_accessibility", val)}
      />

      {/* Question 6: tool_readiness */}
      <MultipleChoiceQuestion
        question="Are your tools and platforms ready to support AI (e.g. infrastructure, APIs, integrations)?"
        options={[
          { value: "not_ready", label: "Not at all" },
          { value: "some_tools", label: "Some tools could be used with effort" },
          { value: "moderate_support", label: "Moderate support for AI integration" },
          { value: "fully_ready", label: "Fully ready — we’ve built for AI use cases" },
        ]}
        value={getStringAnswer(answers["tool_readiness"])}
        onChange={(val) => onAnswer("tool_readiness", val)}
      />

      {/* Question 7: ai_ethics */}
      <MultipleChoiceQuestion
        question="Have you started thinking about ethical considerations for using AI?"
        options={[
          { value: "not_at_all", label: "Not at all" },
          { value: "general_awareness", label: "We’re generally aware of the issues" },
          { value: "discussed_internally", label: "We’ve discussed them internally" },
          { value: "formal_policies", label: "We have or are developing formal policies" },
        ]}
        value={getStringAnswer(answers["ai_ethics"])}
        onChange={(val) => onAnswer("ai_ethics", val)}
      />
    </div>
  );
}
