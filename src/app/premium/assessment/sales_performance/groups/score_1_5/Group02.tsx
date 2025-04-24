"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_47b050"] === "string" &&
    typeof answers["how_12d26c"] === "string" &&
    typeof answers["what_89a231"] === "string" &&
    typeof answers["how_1f869b"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: how_47b050 */}
      <MultipleChoiceQuestion
        question="How often do you review or update your pipeline data (e.g. deal stage, forecast amount)?"
        options={[
          { value: "Rarely_only_when_needed", label: "Rarely — only when needed" },
          { value: "Occasionally_when_checking_progress", label: "Occasionally — when checking progress" },
          { value: "Weekly", label: "Weekly" },
          { value: "Daily_or_during_structured_reviews", label: "Daily or during structured reviews" },
        ]}
        value={getStringAnswer(answers["how_47b050"])}
        onChange={(val) => onAnswer("how_47b050", val)}
      />

      {/* Question 5: how_12d26c */}
      <MultipleChoiceQuestion
        question="How would you describe your lead qualification process?"
        options={[
          { value: "Very_informal_we_go_with_gut_feel", label: "Very informal — we go with gut feel" },
          { value: "We_ask_some_basic_qualifying_questions", label: "We ask some basic qualifying questions" },
          { value: "We_use_a_checklist_or_structured_discovery", label: "We use a checklist or structured discovery" },
          { value: "We_use_a_formal_framework_eg_MEDDIC_BANT", label: "We use a formal framework (e.g. MEDDIC, BANT)" },
        ]}
        value={getStringAnswer(answers["how_12d26c"])}
        onChange={(val) => onAnswer("how_12d26c", val)}
      />

      {/* Question 6: what_89a231 */}
      <TextAreaQuestion
        question="What sales metrics are most important to you right now?"
        placeholder="E.g., lead-to-close ratio, deal size, win rate, etc."
        value={getStringAnswer(answers["what_89a231"])}
        onChange={(val) => onAnswer("what_89a231", val)}
        maxLength={300}
      />

      {/* Question 7: how_1f869b */}
      <MultipleChoiceQuestion
        question="How consistently do you move leads through each sales stage?"
        options={[
          { value: "We_skip_or_rush_through_stages", label: "We skip or rush through stages" },
          { value: "We_loosely_follow_a_set_of_steps", label: "We loosely follow a set of steps" },
          { value: "We_track_movement_but_not_always_accurately", label: "We track movement but not always accurately" },
          { value: "We_move_deals_methodically_through_stages", label: "We move deals methodically through stages" },
        ]}
        value={getStringAnswer(answers["how_1f869b"])}
        onChange={(val) => onAnswer("how_1f869b", val)}
      />
    </div>
  );
}
