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

export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["predictive_models"] === "string" &&
    typeof answers["forecasting"] === "string" &&
    typeof answers["anomaly_detection"] === "string"
  );
}

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you implement predictive models?"
        options={[
          { value: "basic", label: "Basic — statistical models" },
          { value: "advanced", label: "Advanced — machine learning models" },
          { value: "sophisticated", label: "Sophisticated — deep learning models" },
          { value: "cutting_edge", label: "Cutting-edge — ensemble models" },
        ]}
        value={getStringAnswer(answers["predictive_models"])}
        onChange={(val) => onAnswer("predictive_models", val)}
      />

      <MultipleChoiceQuestion
        question="How do you handle forecasting?"
        options={[
          { value: "manual", label: "Manual — basic forecasting" },
          { value: "automated", label: "Automated — statistical forecasting" },
          { value: "advanced", label: "Advanced — ML-based forecasting" },
          { value: "cutting_edge", label: "Cutting-edge — autonomous forecasting" },
        ]}
        value={getStringAnswer(answers["forecasting"])}
        onChange={(val) => onAnswer("forecasting", val)}
      />

      <MultipleChoiceQuestion
        question="How do you implement anomaly detection?"
        options={[
          { value: "basic", label: "Basic — rule-based detection" },
          { value: "advanced", label: "Advanced — statistical detection" },
          { value: "sophisticated", label: "Sophisticated — ML-based detection" },
          { value: "cutting_edge", label: "Cutting-edge — deep learning detection" },
        ]}
        value={getStringAnswer(answers["anomaly_detection"])}
        onChange={(val) => onAnswer("anomaly_detection", val)}
      />
    </div>
  );
} 