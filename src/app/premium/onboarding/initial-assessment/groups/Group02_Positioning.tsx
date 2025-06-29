//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group02_Positioning.tsx
"use client";

import React from "react";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion";
import {
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Question 4: Differentiator */}
      <EnhancedTextAreaQuestion
        question="What makes your business hard to compete with?"
        description="What do you do better, faster, or differently than others in your space? Be specific about your unique advantages."
        placeholder="E.g., We own a proprietary data model that predicts churn 90 days in advance..."
        value={getStringAnswer(answers["differentiator"])}
        onChange={(val) => onAnswer("differentiator", val)}
        maxLength={300}
        rows={4}
      />

      {/* Question 5: Customer Perception */}
      <EnhancedTextAreaQuestion
        question="How would your customers describe your brand in one sentence?"
        description="Imagine you're reading an online review or hearing feedback—what would they say about your company?"
        placeholder="E.g., A scrappy but responsive team that delivers results quickly."
        value={getStringAnswer(answers["brand_perception"])}
        onChange={(val) => onAnswer("brand_perception", val)}
        maxLength={300}
        rows={4}
      />

      {/* Question 6: Strategic Decision-Making */}
      <EnhancedMultipleChoiceQuestion
        question="How do you currently make big strategic decisions?"
        description="When facing big bets—new product, pricing changes, growth pivots—what guides your decision-making process?"
        options={[
          { 
            value: "gut_feel", 
            label: "Mostly gut instinct or experience",
            description: "Rely on intuition and past experience"
          },
          { 
            value: "data_driven", 
            label: "Primarily based on data and analytics",
            description: "Make decisions backed by metrics and analysis"
          },
          { 
            value: "team_alignment", 
            label: "Collective input and cross-functional alignment",
            description: "Gather input from across the organization"
          },
          { 
            value: "executive_top_down", 
            label: "Top-down executive leadership",
            description: "Leadership team makes the final call"
          },
          { 
            value: "board_pressure", 
            label: "Board or investor direction",
            description: "Influenced by board or investor guidance"
          },
          { 
            value: "mixed", 
            label: "A mix of the above",
            description: "Combination of different approaches"
          },
        ]}
        value={getStringAnswer(answers["strategy_decision_method"])}
        onChange={(val) => onAnswer("strategy_decision_method", val)}
        variant="cards"
      />
    </div>
  );
}
