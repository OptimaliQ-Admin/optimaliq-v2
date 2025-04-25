"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tech_scalability"] === "string" &&
    typeof answers["data_governance"] === "string" &&
    typeof answers["innovation_model"] === "string" &&
    typeof answers["cx_personalization"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How scalable is your current technology infrastructure?"
        options={[
          { value: "not_scalable", label: "Not scalable — it’s a major bottleneck" },
          { value: "some_scalability", label: "Somewhat scalable, but with limits" },
          { value: "scales_with_effort", label: "It scales, but requires planning and resources" },
          { value: "fully_scalable", label: "Fully scalable — built to handle growth" },
        ]}
        value={getStringAnswer(answers["tech_scalability"])}
        onChange={(val) => onAnswer("tech_scalability", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How is data governance handled across your organization?"
        options={[
          { value: "no_governance", label: "There’s no clear data governance" },
          { value: "informal_rules", label: "We have informal or team-level rules" },
          { value: "centralized_framework", label: "A centralized framework governs usage" },
          { value: "advanced_governance", label: "Advanced policies and audits are in place" },
        ]}
        value={getStringAnswer(answers["data_governance"])}
        onChange={(val) => onAnswer("data_governance", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How is innovation managed inside your business?"
        options={[
          { value: "random_projects", label: "Ad hoc — random projects pop up" },
          { value: "side_projects", label: "Side projects — innovation happens informally" },
          { value: "allocated_resources", label: "We allocate resources for innovation" },
          { value: "embedded_model", label: "It’s embedded in strategy with formal innovation programs" },
        ]}
        value={getStringAnswer(answers["innovation_model"])}
        onChange={(val) => onAnswer("innovation_model", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="To what degree is your customer experience personalized through digital tools?"
        options={[
          { value: "not_personalized", label: "Not personalized — everyone sees the same thing" },
          { value: "basic_segmentation", label: "Basic segmentation (e.g., email lists)" },
          { value: "dynamic_personalization", label: "Dynamic personalization across key channels" },
          { value: "hyper_personalization", label: "Hyper-personalized — real-time, AI-driven" },
        ]}
        value={getStringAnswer(answers["cx_personalization"])}
        onChange={(val) => onAnswer("cx_personalization", val)}
      />
    </div>
  );
}
