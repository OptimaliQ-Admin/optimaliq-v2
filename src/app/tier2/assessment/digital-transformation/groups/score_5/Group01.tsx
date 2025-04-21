"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["vision_alignment"] === "string" &&
    typeof answers["emerging_tech"] === "string" &&
    typeof answers["execution_rigidity"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How tightly is your digital transformation strategy aligned with your executive team’s vision?"
        options={[
          { value: "no_alignment", label: "It’s not really aligned" },
          { value: "periodic_checkins", label: "We do check-ins but often reactively" },
          { value: "strong_alignment", label: "There’s strong ongoing alignment" },
          { value: "co_created", label: "It’s co-created with leadership and drives org strategy" }
        ]}
        value={answers["vision_alignment"] || ""}
        onChange={(val) => onAnswer("vision_alignment", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How would you describe your appetite for experimentation with emerging technology?"
        options={[
          { value: "low_risk", label: "We avoid risk and stick to proven tools" },
          { value: "selective", label: "We experiment selectively with clear ROI" },
          { value: "early_adopter", label: "We’re early adopters and build pilots regularly" },
          { value: "pioneer", label: "We’re innovation leaders and often create new standards" }
        ]}
        value={answers["emerging_tech"] || ""}
        onChange={(val) => onAnswer("emerging_tech", val)}
      />

      {/* Question 3 */}
      <TextAreaQuestion
        question="What’s the biggest internal challenge you still face when executing your digital strategy?"
        placeholder="E.g., Leadership buy-in, resource prioritization, integration issues"
        value={answers["execution_rigidity"] || ""}
        onChange={(val) => onAnswer("execution_rigidity", val)}
        maxLength={300}
      />
    </div>
  );
}
