"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["what’s_21b168"] === "string" &&
    typeof answers["how_faf5c1"] === "string" &&
    typeof answers["how_4e7ac1"] === "string" &&
    typeof answers["how_1d2529"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: what’s_21b168 */}
      <TextAreaQuestion
        question="What’s one transformational change your sales org has made in the last 6–12 months?"
        placeholder="E.g., RevOps centralization, ICP refinement, AI rollout"
        value={answers["what’s_21b168"] || ""}
        onChange={(val) => onAnswer("what’s_21b168", val)}
        maxLength={300}
      />

      {/* Question 5: how_faf5c1 */}
      <MultipleChoiceQuestion
        question="How does your team capture and act on buyer behavior trends (e.g., engagement data, objections, value perception)?"
        options={[
          { value: "not_tracked", label: "We don’t track it consistently" },
          { value: "review_notes", label: "We review CRM notes or call summaries" },
          { value: "analyze_trends", label: "We analyze trends across deals" },
          { value: "operationalized", label: "We operationalize buyer insights into GTM execution" },
        ]}
        value={answers["how_faf5c1"] || ""}
        onChange={(val) => onAnswer("how_faf5c1", val)}
      />

      {/* Question 6: how_4e7ac1 */}
      <MultipleChoiceQuestion
        question="How do you manage strategic sales bets (new verticals, segments, products)?"
        options={[
          { value: "launch_and_hope", label: "We launch and hope" },
          { value: "test_pilots", label: "We test pilots and gather feedback" },
          { value: "strategic_sprints", label: "We run strategic sprints with target metrics" },
          { value: "predictive_modeling", label: "We manage bets through predictive modeling and cross-functional plans" },
        ]}
        value={answers["how_4e7ac1"] || ""}
        onChange={(val) => onAnswer("how_4e7ac1", val)}
      />

      {/* Question 7: how_1d2529 */}
      <MultipleChoiceQuestion
        question="How are your sales tools and systems helping reps close more effectively?"
        options={[
          { value: "activity_only", label: "They’re mostly for tracking activity" },
          { value: "visibility_reminders", label: "They provide some visibility and reminders" },
          { value: "guided_actions", label: "They guide actions and engagement" },
          { value: "intelligent_copilot", label: "They act as intelligent copilots with context and automation" },
        ]}
        value={answers["how_1d2529"] || ""}
        onChange={(val) => onAnswer("how_1d2529", val)}
      />
    </div>
  );
}
