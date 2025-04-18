"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_1Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["marketing_content_frequency"] === "string" &&
    typeof answers["marketing_strategy"] === "string" &&
    Array.isArray(answers["marketing_channels"]) && answers["marketing_channels"].length > 0 &&
    typeof answers["marketing_tracking"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      {/* Question 4: marketing_content_frequency */}
      <MultipleChoiceQuestion
        question="How often do you create or share marketing content (emails, blogs, videos, etc.)?"
        options={[
          { value: "Never", label: "Never" },
          { value: "Occasionally", label: "Occasionally" },
          { value: "At least monthly", label: "At least monthly" },
          { value: "Weekly or more", label: "Weekly or more" },
        ]}
        value={answers["marketing_content_frequency"] || ""}
        onChange={(val) => onAnswer("marketing_content_frequency", val)}
      />

      {/* Question 5: marketing_strategy */}
      <MultipleChoiceQuestion
        question="How would you describe your marketing strategy?"
        options={[
          { value: "We don’t have one", label: "We don’t have one" },
          { value: "It’s in our head but not written down", label: "It’s in our head but not written down" },
          { value: "It’s lightly documented", label: "It’s lightly documented" },
          { value: "It’s clearly defined and shared with the team", label: "It’s clearly defined and shared with the team" },
        ]}
        value={answers["marketing_strategy"] || ""}
        onChange={(val) => onAnswer("marketing_strategy", val)}
      />

      {/* Question 6: marketing_channels */}
      <MultiSelectQuestion
        question="Which of the following channels do you currently use to market your business?"
        options={[
          { value: "Email marketing", label: "Email marketing" },
          { value: "Organic social (Instagram, LinkedIn, etc.)", label: "Organic social (Instagram, LinkedIn, etc.)" },
          { value: "Paid social (Facebook/IG/LinkedIn ads)", label: "Paid social (Facebook/IG/LinkedIn ads)" },
          { value: "SEO or content marketing", label: "SEO or content marketing" },
          { value: "We don’t actively market", label: "We don’t actively market" },
        ]}
        selected={answers["marketing_channels"] || []}
        onChange={(val) => onAnswer("marketing_channels", val)}
        maxSelect={5}
      />

      {/* Question 7: marketing_tracking */}
      <MultipleChoiceQuestion
        question="How do you track the results of your marketing efforts?"
        options={[
          { value: "We don’t track results", label: "We don’t track results" },
          { value: "We look at basic metrics (likes, opens)", label: "We look at basic metrics (likes, opens)" },
          { value: "We have reports on campaign performance", label: "We have reports on campaign performance" },
          { value: "We track ROI and revenue impact", label: "We track ROI and revenue impact" },
        ]}
        value={answers["marketing_tracking"] || ""}
        onChange={(val) => onAnswer("marketing_tracking", val)}
      />
    </div>
  );
}
