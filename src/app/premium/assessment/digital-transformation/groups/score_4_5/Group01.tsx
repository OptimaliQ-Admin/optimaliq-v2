"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ecosystem_partnerships"] === "string" &&
    typeof answers["digital_governance_model"] === "string" &&
    typeof answers["process_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How are you leveraging ecosystem partnerships in your digital strategy?"
        options={[
          { value: "not_considered", label: "We haven’t considered partnerships" },
          { value: "occasional_partners", label: "We work with partners occasionally" },
          { value: "strategic_partners", label: "Partners are part of specific initiatives" },
          { value: "integrated_ecosystem", label: "We have a defined ecosystem strategy and partner actively" },
        ]}
        value={getStringAnswer(answers["ecosystem_partnerships"])}
        onChange={(val) => onAnswer("ecosystem_partnerships", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="What kind of governance model exists for your digital strategy?"
        options={[
          { value: "none", label: "None — decisions are ad hoc" },
          { value: "basic_guidelines", label: "Some guidelines, but loosely enforced" },
          { value: "structured_model", label: "Structured governance with clear roles" },
          { value: "formal_board", label: "Formal digital governance board oversees progress" },
        ]}
        value={getStringAnswer(answers["digital_governance_model"])}
        onChange={(val) => onAnswer("digital_governance_model", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How well are your digital initiatives aligned with business outcomes?"
        options={[
          { value: "poor_alignment", label: "They aren’t — there’s a disconnect" },
          { value: "some_alignment", label: "Some initiatives are aligned" },
          { value: "mostly_aligned", label: "Most initiatives support key business goals" },
          { value: "fully_aligned", label: "All digital efforts are aligned with measurable outcomes" },
        ]}
        value={getStringAnswer(answers["process_alignment"])}
        onChange={(val) => onAnswer("process_alignment", val)}
      />
    </div>
  );
}
