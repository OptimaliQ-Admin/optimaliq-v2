"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_knowledge"] === "string" &&
    typeof answers["data_foundation"] === "string" &&
    typeof answers["ai_responsibility"] === "string" &&
    typeof answers["workflow_opportunity"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: ai_knowledge */}
      <MultipleChoiceQuestion
        question="How would you rate your team’s general knowledge of AI and automation concepts?"
        options={[
          { value: "not_familiar", label: "Not familiar at all" },
          { value: "some_familiarity", label: "Some familiarity, but unsure how it applies" },
          { value: "functional", label: "Functional — we’ve explored some AI use cases" },
          { value: "proficient", label: "Proficient — we understand what’s possible and what’s not" },
        ]}
        value={getStringAnswer(answers["ai_knowledge"])}
        onChange={(val) => onAnswer("ai_knowledge", val)}
      />

      {/* Question 5: data_foundation */}
      <MultipleChoiceQuestion
        question="How strong is your data foundation (e.g. collection, cleanliness, accessibility)?"
        options={[
          { value: "weak", label: "Weak — we struggle to access or trust our data" },
          { value: "in_progress", label: "In progress — we’re improving structure and quality" },
          { value: "solid", label: "Solid — we have decent quality and structure" },
          { value: "strong", label: "Strong — data is clean, accessible, and reliable" },
        ]}
        value={getStringAnswer(answers["data_foundation"])}
        onChange={(val) => onAnswer("data_foundation", val)}
      />

      {/* Question 6: ai_responsibility */}
      <MultipleChoiceQuestion
        question="Who is primarily responsible for exploring or implementing AI in your org?"
        options={[
          { value: "no_owner", label: "No one yet" },
          { value: "individuals_or_teams", label: "It’s scattered across individuals or teams" },
          { value: "centralized_innovation", label: "A centralized innovation or tech lead" },
          { value: "dedicated_owner", label: "A dedicated AI/automation owner or task force" },
        ]}
        value={getStringAnswer(answers["ai_responsibility"])}
        onChange={(val) => onAnswer("ai_responsibility", val)}
      />

      {/* Question 7: workflow_opportunity */}
      <MultipleChoiceQuestion
        question="How easy is it for you to identify opportunities for automation in your business?"
        options={[
          { value: "hard_to_identify", label: "It’s hard to identify" },
          { value: "some_patterns", label: "We’ve seen some patterns but haven’t acted" },
          { value: "clear_ideas", label: "We have clear ideas on where automation could help" },
          { value: "prioritized_list", label: "We’ve prioritized specific areas or workflows" },
        ]}
        value={getStringAnswer(answers["workflow_opportunity"])}
        onChange={(val) => onAnswer("workflow_opportunity", val)}
      />
    </div>
  );
}
