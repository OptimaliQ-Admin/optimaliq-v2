//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group02_Positioning.tsx
"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isGroup02Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["differentiator"] === "string" &&
    answers["differentiator"].trim().length > 0 &&

    typeof answers["brand_perception"] === "string" &&
    answers["brand_perception"].trim().length > 0 &&

    typeof answers["strategy_decision_method"] === "string" &&
    answers["strategy_decision_method"].trim().length > 0
  );
}


type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};


export default function Group02_Positioning({ answers, onAnswer }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
      {/* Question 4: Differentiator */}
      <TextAreaQuestion
        question="What makes your business hard to compete with?"
        description="What do you do better, faster, or differently than others in your space? Be specific."
        placeholder="E.g., We own a proprietary data model that predicts churn 90 days in advance..."
        value={getStringAnswer(answers["differentiator"])}
        onChange={(val) => onAnswer("differentiator", val)}
        maxLength={300}
      />

      {/* Question 5: Customer Perception */}
      <TextAreaQuestion
        question="How would your customers describe your brand in one sentence?"
        description="Imagine you're reading an online review or hearing feedback—what would they say?"
        placeholder="E.g., A scrappy but responsive team that delivers results quickly."
        value={getStringAnswer(answers["brand_perception"])}
        onChange={(val) => onAnswer("brand_perception", val)}
        maxLength={300}
      />

      {/* Question 6: Strategic Decision-Making */}
      <MultipleChoiceQuestion
        question="How do you currently make big strategic decisions?"
        description="When facing big bets—new product, pricing changes, growth pivots—what guides you?"
        options={[
          { value: "gut_feel", label: "Mostly gut instinct or experience" },
          { value: "data_driven", label: "Primarily based on data and analytics" },
          { value: "team_alignment", label: "Collective input and cross-functional alignment" },
          { value: "executive_top_down", label: "Top-down executive leadership" },
          { value: "board_pressure", label: "Board or investor direction" },
          { value: "mixed", label: "A mix of the above" },
        ]}
        value={getStringAnswer(answers["strategy_decision_method"])}
        onChange={(val) => onAnswer("strategy_decision_method", val)}
        variant="cards"
      />
    </div>
  );
}
