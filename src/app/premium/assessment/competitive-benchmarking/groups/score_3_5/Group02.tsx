"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["benchmarking_process"] === "string" &&
    typeof answers["industry_comparison_frequency"] === "string" &&
    typeof answers["competitive_intel_accuracy"] === "string" &&
    typeof answers["customer_feedback_benchmarking"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: benchmarking_process */}
      <MultipleChoiceQuestion
        question="How formalized is your benchmarking process against peers or competitors?"
        options={[
          { value: "no_process", label: "We don’t benchmark today" },
          { value: "ad_hoc", label: "It’s ad hoc or occasional" },
          { value: "defined_process", label: "We have a defined process we revisit periodically" },
          { value: "ongoing_benchmarking", label: "We run continuous benchmarking" },
        ]}
        value={getStringAnswer(answers["benchmarking_process"])}
        onChange={(val) => onAnswer("benchmarking_process", val)}
      />

      {/* Question 5: industry_comparison_frequency */}
      <MultipleChoiceQuestion
        question="How often do you compare your performance to industry benchmarks?"
        options={[
          { value: "never", label: "Never" },
          { value: "occasionally", label: "Occasionally" },
          { value: "annually", label: "Annually" },
          { value: "quarterly", label: "Quarterly or more often" },
        ]}
        value={getStringAnswer(answers["industry_comparison_frequency"])}
        onChange={(val) => onAnswer("industry_comparison_frequency", val)}
      />

      {/* Question 6: competitive_intel_accuracy */}
      <MultipleChoiceQuestion
        question="How accurate and current is the competitive intelligence your team uses?"
        options={[
          { value: "outdated_or_guesswork", label: "Outdated or based on guesswork" },
          { value: "semi_informed", label: "Somewhat informed — we try to keep up" },
          { value: "reasonably_reliable", label: "Reasonably reliable with periodic updates" },
          { value: "highly_trusted", label: "Highly trusted and frequently refreshed" },
        ]}
        value={getStringAnswer(answers["competitive_intel_accuracy"])}
        onChange={(val) => onAnswer("competitive_intel_accuracy", val)}
      />

      {/* Question 7: customer_feedback_benchmarking */}
      <MultipleChoiceQuestion
        question="Do you benchmark customer satisfaction, retention, or sentiment against competitors?"
        options={[
          { value: "no_feedback_benchmarking", label: "No, we only look at our own data" },
          { value: "informal_awareness", label: "We have informal awareness of competitor satisfaction" },
          { value: "some_surveys", label: "We conduct surveys and try to compare where possible" },
          { value: "formal_benchmarking", label: "Yes, we benchmark regularly with formal methods" },
        ]}
        value={getStringAnswer(answers["customer_feedback_benchmarking"])}
        onChange={(val) => onAnswer("customer_feedback_benchmarking", val)}
      />
    </div>
  );
}
