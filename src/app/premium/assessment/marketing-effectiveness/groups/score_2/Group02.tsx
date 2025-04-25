"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["marketing_tools"]) &&
    answers["marketing_tools"].length > 0 &&
    typeof answers["tools_integration"] === "string" &&
    typeof answers["content_types"] === "string" &&
    typeof answers["brand_consistency"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  const selectedTools = answers["marketing_tools"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 4: marketing_tools */}
      <MultiSelectQuestion
        question="What tools or platforms do you use to manage your marketing?"
        options={[
          { value: "Email marketing or CRM", label: "Email marketing or CRM" },
          { value: "Social media scheduler", label: "Social media scheduler" },
          { value: "Landing page builder", label: "Landing page builder" },
          { value: "Customer data platform (CDP)", label: "Customer data platform (CDP)" },
          { value: "None of these", label: "None of these" },
        ]}
        selected={Array.isArray(getArrayAnswer(selectedTools)) ? getArrayAnswer(selectedTools) : []}
        onChange={(val) => onAnswer("marketing_tools", val)}
        maxSelect={5}
      />

      {/* Question 5: tools_integration */}
      <MultipleChoiceQuestion
        question="How connected are your marketing tools and systems?"
        options={[
          { value: "Not at all", label: "Not at all" },
          { value: "Some manual exports or syncs", label: "Some manual exports or syncs" },
          { value: "Some are integrated", label: "Some are integrated" },
          { value: "Fully integrated with automation", label: "Fully integrated with automation" },
        ]}
        value={getStringAnswer(answers["tools_integration"])}
        onChange={(val) => onAnswer("tools_integration", val)}
      />

      {/* Question 6: content_types */}
      <MultipleChoiceQuestion
        question="What kind of marketing content are you producing?"
        options={[
          { value: "We don’t produce content regularly", label: "We don’t produce content regularly" },
          { value: "Some seasonal or ad hoc content", label: "Some seasonal or ad hoc content" },
          { value: "Blog, social, and email campaigns", label: "Blog, social, and email campaigns" },
          { value: "Consistent multi-channel campaigns", label: "Consistent multi-channel campaigns" },
        ]}
        value={getStringAnswer(answers["content_types"])}
        onChange={(val) => onAnswer("content_types", val)}
      />

      {/* Question 7: brand_consistency */}
      <MultipleChoiceQuestion
        question="How would you describe your brand consistency across platforms?"
        options={[
          { value: "Inconsistent — varies by platform", label: "Inconsistent — varies by platform" },
          { value: "Some consistency — basic branding", label: "Some consistency — basic branding" },
          { value: "Consistent tone and visuals", label: "Consistent tone and visuals" },
          { value: "Fully consistent and on-brand everywhere", label: "Fully consistent and on-brand everywhere" },
        ]}
        value={getStringAnswer(answers["brand_consistency"])}
        onChange={(val) => onAnswer("brand_consistency", val)}
      />
    </div>
  );
}
