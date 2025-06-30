//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group05_Clarity.tsx
"use client";

import React from "react";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isGroup05Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["decision_bottlenecks"] === "string" &&
    answers["decision_bottlenecks"].trim().length > 0 &&
    typeof answers["team_alignment"] === "string" &&
    answers["team_alignment"].trim().length > 0 &&
    typeof answers["future_success"] === "string" &&
    answers["future_success"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group05_Clarity({ answers, onAnswer }: Props) {
  const teamSelected = answers["team_alignment"] || [];
  
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Question 1: Decision Bottlenecks */}
      <EnhancedTextAreaQuestion
        question="What kind of business decisions are hardest for you to make right now?"
        description="Hiring? Prioritization? Marketing spend? Pricing? Something else? This helps us understand your current decision-making challenges."
        placeholder="Be honest. What's slowing you down the most right now? What decisions keep you up at night?"
        value={getStringAnswer(answers["decision_bottlenecks"])}
        onChange={(val) => onAnswer("decision_bottlenecks", val)}
        maxLength={400}
        rows={4}
      />

      {/* Question 2: Team Alignment */}
      <EnhancedMultipleChoiceQuestion
        question="How aligned is your team on company goals and direction?"
        description="This helps us understand your organizational dynamics and identify potential alignment opportunities."
        options={[
          { 
            value: "fully_aligned", 
            label: "Fully aligned and collaborative", 
            description: "Everyone is on the same page and working together effectively" 
          },
          { 
            value: "mostly_aligned", 
            label: "Mostly aligned, occasional friction", 
            description: "Generally aligned with some minor disagreements or miscommunications" 
          },
          { 
            value: "some_misalignment", 
            label: "Some misalignment across departments", 
            description: "Different teams have different priorities or understandings" 
          },
          { 
            value: "not_aligned", 
            label: "No clear alignment — teams are working in silos", 
            description: "Teams operate independently without shared goals or coordination" 
          },
          { 
            value: "other", 
            label: "Other", 
            description: "Unique alignment situation specific to your organization" 
          },
        ]}
        value={typeof teamSelected === "string" ? teamSelected : ""}
        onChange={(val) => onAnswer("team_alignment", val)}
        variant="cards"
      />

      {/* Conditionally show "Other" field */}
      {typeof teamSelected === "string" && teamSelected.includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe the alignment of your team"
          description="Help us understand your unique team dynamics and alignment situation."
          placeholder="Describe the alignment of your team..."
          value={getStringAnswer(answers["team_alignment_other"])}
          onChange={(val) => onAnswer("team_alignment_other", val)}
          maxLength={200}
          rows={3}
        />
      )}

      {/* Question 3: Future State */}
      <EnhancedTextAreaQuestion
        question="What would a wildly successful next 12 months look like for your business?"
        description="Revenue, people, customers, product—describe your future state vividly. This helps us understand your vision and goals."
        placeholder="Paint the picture: What does success look like in 12 months? Be specific about metrics, team size, customer base, product features..."
        value={getStringAnswer(answers["future_success"])}
        onChange={(val) => onAnswer("future_success", val)}
        maxLength={500}
        rows={5}
      />
    </div>
  );
}
