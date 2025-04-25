"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["category_leadership"] === "string" &&
    typeof answers["benchmarking_limitations"] === "string" &&
    typeof answers["benchmarking_tools_review"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_4_9_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: category_leadership */}
      <MultipleChoiceQuestion
        question="Where do you believe your company ranks in your category or space?"
        options={[
          { value: "no_clue", label: "We’re not sure" },
          { value: "middle_of_pack", label: "Somewhere in the middle of the pack" },
          { value: "top_3", label: "We’re in the top 3 or close to it" },
          { value: "category_leader", label: "We are the category leader" },
        ]}
        value={getStringAnswer(answers["category_leadership"])}
        onChange={(val) => onAnswer("category_leadership", val)}
      />

      {/* Question 9: benchmarking_limitations */}
      <MultipleChoiceQuestion
        question="What’s your biggest limitation when it comes to competitive benchmarking?"
        options={[
          { value: "no_data_sources", label: "We don’t have good data sources" },
          { value: "manual_research", label: "Too much manual research or analysis" },
          { value: "not_prioritized", label: "It’s not prioritized across teams" },
          { value: "actionable_confusion", label: "We don’t know how to make it actionable" },
        ]}
        value={getStringAnswer(answers["benchmarking_limitations"])}
        onChange={(val) => onAnswer("benchmarking_limitations", val)}
      />

      {/* Question 10: benchmarking_tools_review */}
      <MultipleChoiceQuestion
        question="How often do you evaluate or refresh the benchmarking tools you use?"
        options={[
          { value: "never", label: "Never — we use what we’ve always used" },
          { value: "yearly", label: "Annually — as part of planning" },
          { value: "quarterly", label: "Quarterly — based on changing needs" },
          { value: "ongoing", label: "Ongoing — we’re always experimenting and iterating" },
        ]}
        value={getStringAnswer(answers["benchmarking_tools_review"])}
        onChange={(val) => onAnswer("benchmarking_tools_review", val)}
      />
    </div>
  );
}
