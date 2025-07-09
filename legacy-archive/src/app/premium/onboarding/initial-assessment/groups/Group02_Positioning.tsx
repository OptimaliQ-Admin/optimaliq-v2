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
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Question 1: Differentiator */}
      <EnhancedTextAreaQuestion
        question="What makes your business hard to compete with?"
        description="What do you do better, faster, or differently than others in your space? This helps us understand your competitive advantages and market positioning."
        placeholder="E.g., We own a proprietary data model that predicts churn 90 days in advance, or we have exclusive partnerships that give us unique market access..."
        value={getStringAnswer(answers["differentiator"])}
        onChange={(val) => onAnswer("differentiator", val)}
        maxLength={400}
        rows={4}
      />

      {/* Question 2: Customer Perception */}
      <EnhancedTextAreaQuestion
        question="How would your customers describe your brand in one sentence?"
        description="Imagine you're reading an online review or hearing feedback—what would they say? This helps us understand your brand perception and customer experience."
        placeholder="E.g., A scrappy but responsive team that delivers results quickly, or the most reliable partner in our industry..."
        value={getStringAnswer(answers["brand_perception"])}
        onChange={(val) => onAnswer("brand_perception", val)}
        maxLength={300}
        rows={3}
      />

      {/* Question 3: Strategic Decision-Making */}
      <EnhancedMultipleChoiceQuestion
        question="How do you currently make big strategic decisions?"
        description="When facing big bets—new product, pricing changes, growth pivots—what guides your decision-making process?"
        options={[
          { 
            value: "gut_feel", 
            label: "Mostly gut instinct or experience", 
            description: "Decisions based on intuition and past experience" 
          },
          { 
            value: "data_driven", 
            label: "Primarily based on data and analytics", 
            description: "Decisions guided by metrics, testing, and analysis" 
          },
          { 
            value: "team_alignment", 
            label: "Collective input and cross-functional alignment", 
            description: "Decisions made through team consensus and collaboration" 
          },
          { 
            value: "executive_top_down", 
            label: "Top-down executive leadership", 
            description: "Decisions made by senior leadership and cascaded down" 
          },
          { 
            value: "board_pressure", 
            label: "Board or investor direction", 
            description: "Decisions influenced by board members or investors" 
          },
          { 
            value: "mixed", 
            label: "A mix of the above", 
            description: "Combination of different approaches depending on the situation" 
          },
        ]}
        value={getStringAnswer(answers["strategy_decision_method"])}
        onChange={(val) => onAnswer("strategy_decision_method", val)}
        variant="cards"
      />
    </div>
  );
}
