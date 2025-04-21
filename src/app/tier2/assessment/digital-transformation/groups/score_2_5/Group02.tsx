"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["data_access"] === "string" &&
    Array.isArray(answers["tech_stack_visibility"]) &&
    answers["tech_stack_visibility"].length > 0 &&
    typeof answers["ownership_alignment"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  const selected = answers["tech_stack_visibility"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: data_access */}
      <MultipleChoiceQuestion
        question="How easily can teams across your company access data they need?"
        options={[
          { value: "very_difficult", label: "It’s very difficult or manual to access" },
          { value: "somewhat_difficult", label: "We have some shared tools, but it’s clunky" },
          { value: "generally_easy", label: "Generally easy across most departments" },
          { value: "real_time", label: "Data is accessible and updated in real time" },
        ]}
        value={answers["data_access"] || ""}
        onChange={(val) => onAnswer("data_access", val)}
      />

      {/* Question 5: tech_stack_visibility */}
      <MultiSelectQuestion
        question="Which areas of your tech stack are highly visible or well-managed?"
        options={[
          { value: "crm", label: "CRM or Customer Database" },
          { value: "ecommerce", label: "Ecommerce or Transaction Systems" },
          { value: "marketing", label: "Marketing and Communications Tools" },
          { value: "finance", label: "Finance or Accounting Platforms" },
          { value: "none", label: "None of the above are well-managed" },
        ]}
        selected={selected}
        onChange={(val) => onAnswer("tech_stack_visibility", val)}
        maxSelect={5}
      />

      {/* Question 6: ownership_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your teams on who owns digital tools and systems?"
        options={[
          { value: "no_alignment", label: "No one really owns them" },
          { value: "some_alignment", label: "There’s informal ownership" },
          { value: "clear_ownership", label: "Each system has a clear owner" },
          { value: "shared_governance", label: "There’s shared governance across departments" },
        ]}
        value={answers["ownership_alignment"] || ""}
        onChange={(val) => onAnswer("ownership_alignment", val)}
      />
    </div>
  );
}
