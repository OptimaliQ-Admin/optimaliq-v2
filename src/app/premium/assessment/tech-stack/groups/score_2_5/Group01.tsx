"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["digital_transformation"] === "string" &&
    typeof answers["cloud_maturity"] === "string" &&
    typeof answers["tech_modernization"] === "string"
  );
}

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How advanced is your digital transformation?"
        options={[
          { value: "initial", label: "Initial — basic digital initiatives" },
          { value: "developing", label: "Developing — ongoing transformation" },
          { value: "advanced", label: "Advanced — significant digital capabilities" },
          { value: "leading", label: "Leading — fully digital enterprise" },
        ]}
        value={getStringAnswer(answers["digital_transformation"])}
        onChange={(val) => onAnswer("digital_transformation", val)}
      />

      <MultipleChoiceQuestion
        question="How mature is your cloud adoption?"
        options={[
          { value: "basic", label: "Basic — some cloud services" },
          { value: "hybrid", label: "Hybrid — mix of cloud and on-premise" },
          { value: "cloud_first", label: "Cloud-first — primarily cloud-based" },
          { value: "cloud_native", label: "Cloud-native — fully cloud-optimized" },
        ]}
        value={getStringAnswer(answers["cloud_maturity"])}
        onChange={(val) => onAnswer("cloud_maturity", val)}
      />

      <MultipleChoiceQuestion
        question="How would you describe your technology modernization?"
        options={[
          { value: "incremental", label: "Incremental — gradual updates" },
          { value: "strategic", label: "Strategic — planned modernization" },
          { value: "transformative", label: "Transformative — major upgrades" },
          { value: "continuous", label: "Continuous — always modern" },
        ]}
        value={getStringAnswer(answers["tech_modernization"])}
        onChange={(val) => onAnswer("tech_modernization", val)}
      />
    </div>
  );
} 