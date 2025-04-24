"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_initiatives"] === "string" &&
    typeof answers["ai_skill_gap"] === "string" &&
    typeof answers["ai_goal_clarity"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_initiatives */}
      <MultipleChoiceQuestion
        question="Which best describes your current AI initiatives?"
        options={[
          { value: "early_research", label: "We’re doing early research or ideation" },
          { value: "pilot_projects", label: "We’re testing small AI use cases or pilot projects" },
          { value: "departmental_use", label: "We use AI in some departments or functions" },
          { value: "company_wide_strategy", label: "We have a company-wide AI strategy and roadmap" },
        ]}
        value={answers["ai_initiatives"] || ""}
        onChange={(val) => onAnswer("ai_initiatives", val)}
      />

      {/* Question 2: ai_skill_gap */}
      <MultipleChoiceQuestion
        question="How would you describe your internal skill set for working with AI?"
        options={[
          { value: "no_internal_skills", label: "We have no internal AI skills" },
          { value: "limited_knowledge", label: "Some awareness, but little practical knowledge" },
          { value: "growing_team", label: "We have a growing team with AI experience" },
          { value: "mature_expertise", label: "We have mature teams with hands-on AI capabilities" },
        ]}
        value={answers["ai_skill_gap"] || ""}
        onChange={(val) => onAnswer("ai_skill_gap", val)}
      />

      {/* Question 3: ai_goal_clarity */}
      <MultipleChoiceQuestion
        question="Do you have clear goals for what AI should accomplish in your business?"
        options={[
          { value: "no_goals", label: "Not yet — we’re still exploring" },
          { value: "some_ideas", label: "We have a few use cases in mind" },
          { value: "departmental_goals", label: "We’ve set goals at the team or department level" },
          { value: "strategic_goals", label: "Yes — we have strategic goals tied to business outcomes" },
        ]}
        value={answers["ai_goal_clarity"] || ""}
        onChange={(val) => onAnswer("ai_goal_clarity", val)}
      />
    </div>
  );
}
