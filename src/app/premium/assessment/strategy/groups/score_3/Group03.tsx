"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["testing_methodology"] === "string" &&
    typeof answers["customer_journey_map"] === "string" &&
    typeof answers["content_strategy_maturity"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How structured is your A/B testing or experimentation process?"
        options={[
          { value: "none", label: "We don’t test" },
          { value: "ad_hoc", label: "Ad hoc — no formal process" },
          { value: "organized", label: "Organized — we test with defined hypotheses" },
          { value: "ongoing", label: "Ongoing — it's embedded in every campaign" },
        ]}
        value={getStringAnswer(answers["testing_methodology"])}
        onChange={(val) => onAnswer("testing_methodology", val)}
      />

      <MultipleChoiceQuestion
        question="How developed is your customer journey mapping?"
        options={[
          { value: "not_defined", label: "Not defined" },
          { value: "basic", label: "Basic — some touchpoints are outlined" },
          { value: "detailed", label: "Detailed — journeys are mapped across channels" },
          { value: "optimized", label: "Optimized — we constantly improve based on journeys" },
        ]}
        value={getStringAnswer(answers["customer_journey_map"])}
        onChange={(val) => onAnswer("customer_journey_map", val)}
      />

      <MultipleChoiceQuestion
        question="How would you describe your content strategy maturity?"
        options={[
          { value: "no_strategy", label: "No strategy — content is reactive" },
          { value: "basic_calendar", label: "Basic — we use a calendar and themes" },
          { value: "targeted_content", label: "Targeted — content aligns to personas" },
          { value: "integrated_strategy", label: "Integrated — content is tied to funnel and measurement" },
        ]}
        value={getStringAnswer(answers["content_strategy_maturity"])}
        onChange={(val) => onAnswer("content_strategy_maturity", val)}
      />
    </div>
  );
}
