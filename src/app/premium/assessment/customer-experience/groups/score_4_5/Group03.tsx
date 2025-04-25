"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_predictive_insights"] === "string" &&
    typeof answers["cx_experience_testing"] === "string" &&
    typeof answers["cx_journey_mapping"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 8: cx_predictive_insights */}
      <MultipleChoiceQuestion
        question="Do you use predictive analytics or AI to improve customer experience?"
        options={[
          { value: "no_prediction", label: "No — we react based on past activity" },
          { value: "basic_segmentation", label: "We use segmentation and behavior triggers" },
          { value: "predictive_modeling", label: "We use some predictive modeling" },
          { value: "ai_driven_experience", label: "Yes — AI actively drives CX decisions" },
        ]}
        value={getStringAnswer(answers["cx_predictive_insights"])}
        onChange={(val) => onAnswer("cx_predictive_insights", val)}
      />

      {/* Question 9: cx_experience_testing */}
      <MultipleChoiceQuestion
        question="How often do you test and optimize your CX efforts?"
        options={[
          { value: "no_testing", label: "We don’t run formal tests" },
          { value: "ad_hoc_testing", label: "Occasional tests (e.g., A/B emails)" },
          { value: "regular_testing", label: "We run regular tests across touchpoints" },
          { value: "embedded_optimization", label: "Optimization is embedded into our workflows" },
        ]}
        value={getStringAnswer(answers["cx_experience_testing"])}
        onChange={(val) => onAnswer("cx_experience_testing", val)}
      />

      {/* Question 10: cx_journey_mapping */}
      <MultipleChoiceQuestion
        question="Do you map and monitor the entire customer journey?"
        options={[
          { value: "no_journey_map", label: "No — we focus on single-channel metrics" },
          { value: "basic_journey_map", label: "We’ve mapped major parts of the journey" },
          { value: "monitored_journey", label: "We monitor journey stages across touchpoints" },
          { value: "live_journey_orchestration", label: "We orchestrate and optimize the full journey in real-time" },
        ]}
        value={getStringAnswer(answers["cx_journey_mapping"])}
        onChange={(val) => onAnswer("cx_journey_mapping", val)}
      />
    </div>
  );
}
